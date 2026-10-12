from app.models import Operator, TriagedClaim
from app import store

REASON_TO_SKILL = {
    "MR-01": "MEDICAL_RECORD_REVIEW",
    "MISSING_DOCS": "MEDICAL_RECORD_REVIEW",
    "COB_VERIFY": "SIMPLE_ERROR_CORRECTION",
    "PRICE_REVIEW": "SIMPLE_ERROR_CORRECTION",
}
HIGH_DOLLAR_THRESHOLD = 10000

def required_skills(core, pend) -> list[str]:
    skills = {REASON_TO_SKILL.get(pend.pend_reason_code, "SIMPLE_ERROR_CORRECTION")}
    if not core.par_flag:
        skills.add("OUT_OF_NETWORK")
    if core.billed_amount >= HIGH_DOLLAR_THRESHOLD:
        skills.add("HIGH_DOLLAR")
    return sorted(skills)

def operator_qualifies(op: Operator, claim: TriagedClaim) -> bool:
    limits = {s.skill_type: s.dollar_signoff_limit for s in op.skills}
    billed = claim.intake.claim_core.billed_amount
    return all(
        skill in limits and limits[skill] >= billed
        for skill in claim.required_skills
    )

def assigned_count(op_id: str) -> int:
    return sum(1 for c in store.claims if c.assigned_operator_id == op_id)

def run_matching():
    queued = [c for c in store.claims if c.status == "QUEUED"]
    queued.sort(key=lambda c: c.priority_score, reverse=True)
    for claim in queued:
        for op in store.operators:
            if (operator_qualifies(op, claim)
                    and assigned_count(op.operator_id) < op.max_daily_capacity):
                claim.assigned_operator_id = op.operator_id
                claim.status = "ASSIGNED"
                break