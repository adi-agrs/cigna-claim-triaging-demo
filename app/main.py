from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import ClaimIntake, TriagedClaim
from app.scoring import calculate_priority_score
from app.matching import run_matching
from app import store

app = FastAPI()

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
    score = calculate_priority_score(core.model_dump(), pend.model_dump() if pend else {})
    
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