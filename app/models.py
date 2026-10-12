from pydantic import BaseModel
from typing import Optional

class ClaimCore(BaseModel):
    claim_id: str
    date: str
    billed_amount: float
    allowed_amount: float
    par_flag: bool
    provider_id: str
    client_id: str

class PendInstance(BaseModel):
    pend_instance_id: str
    claim_id: str
    pend_date: str
    pend_reason_code: str
    pend_status: str

class ClaimIntake(BaseModel):
    claim_core: ClaimCore
    claim_pend_instances: list[PendInstance]

class Skill(BaseModel):
    skill_type: str
    dollar_signoff_limit: float

class Operator(BaseModel):
    operator_id: str
    first_name: str
    last_name: str
    tier_level: int
    max_daily_capacity: int
    skills: list[Skill]

class TriagedClaim(BaseModel):
    intake: ClaimIntake
    priority_score: float
    required_skills: list[str]
    assigned_operator_id: Optional[str] = None
    status: str = "QUEUED"   # QUEUED or ASSIGNED