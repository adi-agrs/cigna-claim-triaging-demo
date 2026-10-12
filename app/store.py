import json
from pathlib import Path
from app.models import Operator, TriagedClaim

DATA_DIR = Path(__file__).parent.parent / "data"

operators: list[Operator] = [
    Operator(**o) for o in json.loads((DATA_DIR / "operators.json").read_text())
]
claims: list[TriagedClaim] = []

