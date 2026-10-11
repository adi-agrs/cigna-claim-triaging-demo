# {
#   "claim_core": {
#     "claim_id": "CLM-2026-98745",
#     "date": "2026-10-10",
#     "billed_amount": 450.00,
#     "allowed_amount": 320.00,
#     "par_flag": true,
#     "provider_id": "NPI1234567890",
#     "client_id": "CLI-BLUE-CROSS-01"
#   },
#   "claim_pend_instances": [
#     {
#       "pend_instance_id": "PND-88321",
#       "claim_id": "CLM-2026-98745",
#       "pend_date": "2026-10-10T14:32:00Z",
#       "pend_reason_code": "MR-01",
#       "pend_status": "Open"
#     }
#   ]
# }

from datetime import datetime, date

def calculate_priority_score(claim, pend_instance, current_date=None):
    if current_date is None:
        current_date = date.today()
        
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
        (fin_score * 0.35) + 
        (age_score * 0.30) + 
        (strat_score * 0.20) + 
        (eff_score * 0.15)
    )
    
    return round(final_score, 2)

# # --- Example Usage ---
# mock_claim = {
#     "claim_id": "CLM-2026-98745",
#     "billed_amount": 55000.00,
#     "par_flag": False,
#     "client_id": "CLI-BLUE-CROSS-01"
# }

# mock_pend = {
#     "pend_date": "2026-09-10", # 30 days old relative to Oct 10, 2026
#     "pend_reason_code": "MR-01" 
# }

# # Running calculation using the current evaluation date
# eval_date = date(2026, 10, 10)
# priority = calculate_priority_score(mock_claim, mock_pend, current_date=eval_date)

# print(f"Claim Priority Score: {priority} / 100")
