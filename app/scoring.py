from datetime import datetime, date

DEFAULT_WEIGHTS = {
    "financial": 35,
    "aging": 30,
    "strategic": 20,
    "efficiency": 15,
}

def validate_weights(weights):
    required = set(DEFAULT_WEIGHTS)

    if set(weights) != required:
        raise ValueError("Exactly four priority weights are required.")

    if any(
        not isinstance(weight, (int, float))
        or isinstance(weight, bool)
        or weight < 0
        for weight in weights.values()
    ):
        raise ValueError("Weights must be non-negative numbers.")

    if not abs(sum(weights.values()) - 100) < 1e-9:
        raise ValueError("Priority weights must add up to 100.")

    return weights

def calculate_priority_score(claim, pend_instance, current_date=None, weights=None):
    if current_date is None:
        current_date = date.today()

    if weights is None:
        weights = DEFAULT_WEIGHTS

    validate_weights(weights)
        
    # 1. Financial Impact Score (35%)
    billed = claim.get("billed_amount", 0)
    if billed >= 50000: fin_score = 100
    elif billed >= 10000: fin_score = 75
    elif billed >= 1000: fin_score = 50
    else: fin_score = 25


    # 2. Aging Score (30%)
    # Parse pend date (handles string or date object)
    p_date = pend_instance.get("pend_date")
    if isinstance(p_date, str):
        p_date = datetime.strptime(p_date[:10], "%Y-%m-%d").date()

    if p_date is None:
        days_pended = 0
    else:
        days_pended = (current_date - p_date).days
    
    if days_pended >= 25: age_score = 100
    elif days_pended >= 15: age_score = 75
    elif days_pended >= 5: age_score = 50
    else: age_score = 10

    # 3. Strategic Risk Score (20%)
    # Let's assume certain major clients get VIP tiering
    vip_clients = ["CLI-BLUE-CROSS-01", "CLI-MEGA-CORP"]
    
    is_vip = claim.get("client_id") in vip_clients
    is_par = claim.get("par_flag", True)
    
    if is_vip and not is_par: strat_score = 100
    elif is_vip and is_par: strat_score = 75
    elif not is_vip and not is_par: strat_score = 50
    else: strat_score = 25

    # 4. Efficiency Score (15%)
    # Classify complexity based on the pend reason code
    reason = pend_instance.get("pend_reason_code", "")
    if reason in ["MR-01", "MISSING_DOCS"]:  # High effort medical record reviews
        eff_score = 10
    elif reason in ["COB_VERIFY", "PRICE_REVIEW"]:  # Medium effort
        eff_score = 50
    else:  # Simple fixes or system glitches
        eff_score = 100

    # Calculate Weighted Final Score
    final_score = (
        (fin_score * (weights["financial"] / 100))
        + (age_score * (weights["aging"] / 100))
        + (strat_score * (weights["strategic"] / 100))
        + (eff_score * (weights["efficiency"] / 100))
    )
    
    return round(final_score, 2)


