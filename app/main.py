from fastapi import FastAPI
from app.models import ClaimIntake, TriagedClaim
from app.scoring import calculate_priority_score
from app.matching import required_skills, run_matching
from app import store

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/claims", response_model=TriagedClaim)
def create_claim(intake: ClaimIntake):
    core = intake.claim_core
    pend = intake.claim_pend_instances[0]
    score = calculate_priority_score(core.model_dump(), pend.model_dump())
    claim = TriagedClaim(
        intake=intake,
        priority_score=score,
        required_skills=required_skills(core, pend),
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
        {**op.model_dump(),
         "assigned_claims": [c.intake.claim_core.claim_id for c in store.claims
                             if c.assigned_operator_id == op.operator_id]}
        for op in store.operators
    ]
