import json
from pathlib import Path
from app.models import Operator, TriagedClaim, ClaimIntake
from app.scoring import calculate_priority_score

DATA_DIR = Path(__file__).parent.parent / "data"

REASON_TO_SKILL = {
    "MR-01": "MEDICAL_RECORD_REVIEW",
    "MISSING_DOCS": "MEDICAL_RECORD_REVIEW",
    "COB_VERIFY": "SIMPLE_ERROR_CORRECTION",
    "PRICE_REVIEW": "SIMPLE_ERROR_CORRECTION",
    "AUTH-02": "SIMPLE_ERROR_CORRECTION",
}
HIGH_DOLLAR_THRESHOLD = 10000

def get_required_skills(core, pend) -> list[str]:
    if not pend:
        return ["SIMPLE_ERROR_CORRECTION"]
    skills = {REASON_TO_SKILL.get(pend.pend_reason_code, "SIMPLE_ERROR_CORRECTION")}
    if not core.par_flag:
        skills.add("OUT_OF_NETWORK")
    if core.billed_amount >= HIGH_DOLLAR_THRESHOLD:
        skills.add("HIGH_DOLLAR")
    return sorted(skills)

# Load operators safely
operators: list[Operator] = []
op_file = DATA_DIR / "operators.json"
if op_file.exists():
    operators = [Operator(**o) for o in json.loads(op_file.read_text())]

# Load and score initial claims from seed_claims.json safely
claims: list[TriagedClaim] = []
claims_file = DATA_DIR / "seed_claims.json"

if claims_file.exists():
    raw_claims_data = json.loads(claims_file.read_text())
    for raw in raw_claims_data:
        intake = ClaimIntake(**raw)
        core = intake.claim_core
        pend = intake.claim_pend_instances[0] if intake.claim_pend_instances else None
        
        score = 50.0
        if pend:
            score = calculate_priority_score(core.model_dump(), pend.model_dump())
            
        skills = get_required_skills(core, pend)

        claim = TriagedClaim(
            intake=intake,
            priority_score=score,
            required_skills=skills,
            status="QUEUED"
        )
        claims.append(claim)