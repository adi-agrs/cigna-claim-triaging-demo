from fastapi.middleware.cors import CORSMiddleware
from app.models import ClaimIntake, TriagedClaim
from app.scoring import calculate_priority_score, DEFAULT_WEIGHTS, validate_weights
from app.matching import run_matching
from app import store
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class AssignmentUpdate(BaseModel):
    operator_id: str | None = None

class PriorityWeights(BaseModel):
    financial: float
    aging: float
    strategic: float
    efficiency: float


# Current settings for this backend process
priority_weights = DEFAULT_WEIGHTS.copy()

@app.on_event("startup")
def startup_event():
    run_matching()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run initial matching safely after everything is fully loaded
@app.on_event("startup")
def startup_event():
    run_matching()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/claims", response_model=TriagedClaim)
def create_claim(intake: ClaimIntake):
    # Import matching functions locally to avoid circular dependencies
    from app.matching import required_skills, run_matching
    
    core = intake.claim_core
    pend = intake.claim_pend_instances[0] if intake.claim_pend_instances else None
    score = calculate_priority_score(core.model_dump(),
                                      pend.model_dump() if pend else {},
                                      weights=priority_weights,
                                      )
    
    skills = required_skills(core, pend) if pend else ["SIMPLE_ERROR_CORRECTION"]
    
    claim = TriagedClaim(
        intake=intake,
        priority_score=score,
        required_skills=skills,
        status="QUEUED"
    )
    store.claims.append(claim)
    run_matching()
    return claim

@app.get("/claims", response_model=list[TriagedClaim])
def list_claims():
    return sorted(store.claims, key=lambda c: c.priority_score, reverse=True)

@app.get("/operators")
def list_operators():
    return [
        {
            **op.model_dump(),
            "assigned_claims": [
                c.intake.claim_core.claim_id for c in store.claims
                if c.assigned_operator_id == op.operator_id
            ]
        }
        for op in store.operators
    ]


@app.get("/priority-model")
def get_priority_model():
    return priority_weights


@app.put("/priority-model")
def update_priority_model(weights: PriorityWeights):
    global priority_weights

    new_weights = weights.model_dump()

    try:
        validate_weights(new_weights)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # Save the new weights for this running backend
    priority_weights = new_weights

    # Recalculate scores for claims already in memory
    for claim in store.claims:
        core = claim.intake.claim_core

        pend = (
            claim.intake.claim_pend_instances[0]
            if claim.intake.claim_pend_instances
            else None
        )

        claim.priority_score = calculate_priority_score(
            core.model_dump(),
            pend.model_dump() if pend else {},
            weights=priority_weights,
        )

    # Re-run assignment after the priority order changes
    run_matching()

    return {
        "message": "Priority model updated successfully",
        "weights": priority_weights,
    }

@app.put("/claims/{claim_id}/assignment", response_model=TriagedClaim)
def set_assignment(claim_id: str, body: AssignmentUpdate):
    claim = next(
        (c for c in store.claims if c.intake.claim_core.claim_id == claim_id),
        None,
    )
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found.")

    if body.operator_id is None:
        claim.assigned_operator_id = None
        claim.status = "QUEUED"
        claim.manual_override = False

    else:
        operator = next(
            (o for o in store.operators if o.operator_id == body.operator_id),
            None,
        )
        if operator is None:
            raise HTTPException(status_code=404, detail="Operator not found.")

        # Overwriting the single field moves the claim off the old operator
        claim.assigned_operator_id = operator.operator_id
        claim.status = "ASSIGNED"
        claim.manual_override = True

    # The previous operator just freed a slot, so let waiting QUEUED claims use it
    run_matching()
    return claim


@app.post("/claims/{claim_id}/unassign", response_model=TriagedClaim)
def unassign_claim(claim_id: str):
    from app.matching import run_matching
    
    target_claim = None
    for claim in store.claims:
        if claim.intake.claim_core.claim_id == claim_id:
            target_claim = claim
            break
            
    if not target_claim:
        raise HTTPException(status_code=404, model_detail="Claim not found")
        
    target_claim.assigned_operator_id = None
    target_claim.manual_override = False
    target_claim.status = "QUEUED"
    
    # Re-run matching so the rules engine can pick a new operator automatically
    run_matching()
    return target_claim