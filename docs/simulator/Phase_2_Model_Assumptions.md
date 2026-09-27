---
id: SIM-ASSUMP-002
type: assumptions
status: CURRENT
owner: Architecture & Simulator Team
phase: Phase 2
confidence: HIGH
last_verified: 2026-09-27
sources:
  - SRC-001
  - SRC-005
  - SRC-007
  - SRC-008
  - SRC-010
  - SRC-011
  - SRC-012
  - SRC-013
  - SRC-014
  - SRC-015
  - ADR-002
  - ADR-003
  - ADR-004
  - ADR-005
  - ADR-006
  - ADR-007
  - ADR-008
blocks: []
supersedes: []
---

# WattWise Operating Simulator — Phase 2 Model Assumptions & Epistemic Foundations

This document records the foundational modeling assumptions, uncertainty inheritance rules, simulation scenario sets, and epistemic boundaries established during Phase 2.

---

## 1. Epistemic Principles & Guardrails

1. **Uncertainty Inheritance Principle:** Any derived output (such as `gross_margin_rate`, `cac`, or `cash_runway_months`) is strictly an assumption-derived output if its upstream drivers are simulation parameters or unvalidated hypotheses. Mathematical computation does not transform a hypothesis into verified business truth.
2. **Empirical Grounding Boundary:** Facts verified in snapshot code (`03_CURRENT_TRUTH`) are classified as `CURRENT`. Targets from pitches or PRDs are classified as `TARGET` or `HYPOTHESIS`. All scenario testing values are explicitly tagged `SIMULATION`.
3. **Decision-Support Positioning:** The simulator models WattWise as an energy decision-support system, not an automated appliance diagnosis tool. Simulator outputs must never assume guaranteed monetary savings for end users.
4. **Hardware-Agnostic Reality:** WattWise operates primarily on manual billing inputs and utility invoices. Hardware IoT devices remain strictly optional future scenarios, not baseline requirements.
5. **No Production Parity Assumption:** Behavior verified in local code snapshots does not prove live production server parity. Discrepancies between approved baselines and prototype snapshot code are formally tracked as `IMPLEMENTATION GAPs`.

---

## 2. Canonical Accepted Baselines vs. Simulation Alternatives

The following baseline parameters were established via formal Architecture Decision Records (ADR-002 through ADR-008) approved by the Human Project Owner on 2026-09-27:

| Variable | Approved Canonical Baseline | Simulation Alternative Scenarios | Governing ADR / Rationale |
| :--- | :--- | :--- | :--- |
| `business_tier_location_cap` | **50 locations** | `[5, 10, 50]` | **ADR-002:** Matches backend code `FeatureGateService.php`. Simulator models support burden, storage bloat, and margin dilution. |
| `pro_tier_location_cap` | **3 locations** | `[1, 3]` | **ADR-004:** Matches backend code `FeatureGateService.php`. Simulator tests cannibalization risk against Business tier upgrades. |
| `trial_activation_trigger` | **EXPLICIT** | `[EXPLICIT, AUTOMATIC]` | **ADR-003:** Matches code `PlanController::startTrial`. Models deliberate user opt-in vs automatic top-of-funnel flood. |
| `free_history_retention_mode` | **ROLLING_3_MONTH_WINDOW** | `[ROLLING_3_MONTH_WINDOW, HARD_3_ENTRY_LIFETIME_CAP]` | **ADR-005:** Product baseline allows ongoing habit tracking. Prototype hard lifetime cap (`count >= 3`) preserved as paywall stress test. |
| `forecast_method` | **DETERMINISTIC_HEURISTIC** | `[DETERMINISTIC_HEURISTIC, GRADIENT_BOOSTING, LSTM, OTHER_ML]` | **ADR-006:** Pure PHP moving average + linear trend slope. ML is **NOT CURRENT**; GPU costs are Rp0 in baseline. |
| `data_provenance_mode` | **STRICT_TAGGED** | `[STRICT_TAGGED, UNTAGGED_UNIFORM]` | **ADR-007:** Mandatory contract distinguishing physical meter reads from estimates. Prototype lacking `is_estimated` flag is an implementation gap. |
| `revenue_after_electricity` | **Canonical metric** ("Sisa Pendapatan Setelah Listrik") | Standardized | **ADR-008:** Semantic accounting accuracy for client contribution. "Sisa Kas Bersih" permanently retired. |

---

## 3. Simulation Scenario Parameter Sets

For variables where empirical field truth is unknown, the simulator defines discrete scenario brackets for sensitivity testing. All scenario brackets are explicitly classified as **`ILLUSTRATIVE_RANGE_PENDING_CALIBRATION`** with **`empirical_validation_required = YES`**:

### Funnel & Growth Scenarios
- **Onboarding Completion Rate (`onboarding_completion_rate`):**
  - *Classification:* `HYPOTHESIS / SIMULATION_ASSUMPTION` (`empirical_validation_required = YES`)
  - *Conservative / High Friction:* `0.30` (30%)
  - *Pilot Baseline:* `0.50` (50%)
  - *PRD §15 Target:* `0.60` (60%)
  - *Optimistic Stretch:* `0.85` (85%)
- **Trial-to-Paid Conversion Rate (`trial_to_paid_conversion_rate`):**
  - *Classification:* `SOURCE_BACKED_TARGET / SIMULATION_ASSUMPTION` (`empirical_validation_required = YES`)
  - *Pessimistic:* `0.01` (1%)
  - *PRD Baseline Target:* `0.03` (3%)
  - *Optimistic Target:* `0.05` (5%)
  - *Stretch Target (Brief S00):* `0.10` (10%)
- **Monthly Account Churn Rate (`monthly_account_churn_rate`):**
  - *Classification:* `SOURCE_BACKED_TARGET / SIMULATION_ASSUMPTION` (`empirical_validation_required = YES`)
  - *Best-in-Class SaaS:* `0.03` (3% / month $\implies 33.3$ month lifetime)
  - *Baseline Target (Brief S00):* `0.05` (5% / month $\implies 20.0$ month lifetime)
  - *Moderate Commercial Churn:* `0.08` (8% / month $\implies 12.5$ month lifetime)
  - *Stress-Test / High Churn:* `0.15` (15% / month $\implies 6.7$ month lifetime)

### Operational & Support Scenarios
- **Average Locations per Business Account (`average_locations_per_business_account`):**
  - *Classification:* Baseline = `UNKNOWN`; Scenarios = `SIMULATION_ASSUMPTION` (`empirical_validation_required = YES`)
  - *Single Multi-Site:* `2.0` locations
  - *Pilot Target Portfolio:* `5.0` locations
  - *Standard Commercial Group:* `8.0` locations
  - *Aggressive Enterprise:* `25.0` locations
  - *Cap Stress-Test:* `50.0` locations (ADR-002 ceiling)
- **Support Burden & Ticket Costs:**
  - *Classification:* `SIMULATION_ASSUMPTION` (`empirical_validation_required = YES`)
  - *Cost per Ticket (`support_cost_per_ticket`):* `[Rp10.000, Rp25.000, Rp60.000]`
  - *Incremental Ticket per Branch (`support_tickets_per_location`):* `[0.02, 0.10, 0.30]` tickets/location/month
  - *Team Resolution Capacity (`support_capacity`):* `[50, 100, 300]` tickets/month

### Forecasting Scenarios
- **Forecast MAPE Error Rate (`forecast_error_rate`):**
  - *Classification:* Baseline = `UNKNOWN`; Scenarios = `SIMULATION_ASSUMPTION` (`empirical_validation_required = YES`)
  - *Empirical Baseline:* `UNKNOWN` (Forecasting heuristic not benchmarked against actual commercial interval meter data).
  - *Illustrative Scenarios:* `[0.04, 0.12, 0.25]` pending calibration.
  - *Epistemic Boundary:* `0.12` is NOT a verified baseline; `0.07` is NOT an ML expected accuracy. Machine Learning remains `TARGET / FUTURE / SIMULATION`, not current production reality.

---

## 4. Modeling Next Steps (Phase 3 Boundaries)

In Phase 3 (Core Simulation Engine), the following formal structures will be built upon this dictionary only after human gate authorization:
1. **Discrete-Event State Machine:** Implementing customer cohort transitions (`SIGNUP` $\to$ `ONBOARDED` $\to$ `IN_TRIAL` $\to$ `PAID_PRO` / `PAID_BUSINESS` $\to$ `CHURNED`).
2. **Cohort Aging Engine:** Tracking longitudinal cohorts month-by-month with cumulative data history and retention decay.
3. **Execution Formulas & Coefficient Matrices:** Formulating executable code to calculate revenue, COGS, support burden, and runway without violating governance boundaries.

**Note:** Phase 3 remains `LOCKED / READY FOR HUMAN AUTHORIZATION`. No calculation code or scenario execution is built during Phase 2.
