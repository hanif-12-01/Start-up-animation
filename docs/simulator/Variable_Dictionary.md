---
id: SIM-VARDIC-001
type: dictionary
status: CURRENT
owner: Architecture & Simulator Team
phase: Phase 2
confidence: HIGH
last_verified: 2026-09-27
sources:
  - SRC-001
  - SRC-002
  - SRC-005
  - SRC-006
  - SRC-007
  - SRC-008
  - SRC-009
  - SRC-010
  - SRC-011
  - SRC-012
  - SRC-013
  - SRC-014
  - SRC-015
  - SRC-016
  - SRC-018
  - SRC-020
  - ADR-002
  - ADR-003
  - ADR-004
  - ADR-005
  - ADR-006
  - ADR-007
  - ADR-008
blocks: []
supersedes:
  - Simulator/Simulation_Variable_Candidates.md
---

# WattWise Operating Simulator — Master Variable Dictionary
## Phase 2 Model Foundation

This document is the authoritative, standardized Variable Dictionary for the WattWise Operating Simulator. It defines what the simulator knows, what parameters a human or scenario can adjust, what states describe the simulated enterprise and customer cohorts, and what primary outputs are tracked.

> [!IMPORTANT]
> **Phase 2 Modeling Boundary:**
> - This dictionary catalogs formal metadata, accepted baselines, scenario alternatives, source provenance, and causal linkages.
> - **Execution formulas, algorithms, scenario runners, and simulator engines are strictly prohibited in Phase 2** and belong to Phase 3.
> - Mathematical identities noted herein serve solely as semantic clarifications.

---

## 1. Variable Taxonomy & Schema Summary

### Role Distribution
- **`INPUT` (20 variables):** Direct scenario levers and human-editable parameters.
- **`STATE` (7 variables):** Internal system, cohort, and enterprise condition counters.
- **`DERIVED` (25 variables):** Calculated state and intermediate outcome variables.
- **`OUTPUT` (4 variables):** Top-level enterprise results and primary dashboard indicators.
- **`CONTROL` (8 variables):** Discrete switches altering product logic or system behavior.
- **`CONSTANT` (3 variables):** Stable reference parameters and empirical bounds.
- **Total Variables:** **67**

### Domain Distribution
| Domain | Variable Count | Core Focus |
| :--- | :---: | :--- |
| **PRODUCT** | 7 | Packaging rules, tier limits, data retention, trial mechanics |
| **PRICING** | 2 | Tier subscription price points |
| **CUSTOMER_JOURNEY** | 8 | Top-of-funnel traffic, onboarding completion, trial throughput |
| **GROWTH** | 4 | Leads, sales conversion, customer referrals |
| **GTM** | 2 | Marketing expenditure, Customer Acquisition Cost (CAC) |
| **RETENTION** | 3 | Account churn, retained subscriber cohort aging |
| **REVENUE** | 12 | Tier MRR, total MRR, ARR, ARPU, ARPA per account and location |
| **OPERATIONS** | 4 | Multi-site location density, ticket generation rates, team capacity |
| **SUPPORT** | 3 | Support burden index, ticket resolution cost, support spend |
| **COST** | 7 | Hosting, database, inference, gateway, support, marketing OpEx |
| **FINANCE** | 6 | Gross profit, gross margin, cash burn, reserves, runway, revenue after electricity |
| **DATA_QUALITY** | 5 | Meter provenance, synthetic estimation ratio, completeness, data health score |
| **FORECASTING** | 4 | Forecast algorithm, MAPE error rate, confidence rating, compute cost |
| **Total** | **67** | **Comprehensive venture & product dynamics coverage** |

---

## 2. Master Variable Catalog

### Domain 1: PRODUCT

#### `free_plan_enabled`
- **Display Name:** Free Plan Availability
- **Domain:** `PRODUCT`
- **Description:** Controls whether the zero-cost Free tier is accessible for customer acquisition.
- **Role:** `CONTROL`
- **Data Type:** `boolean`
- **Unit:** `boolean`
- **Knowledge Status:** `CURRENT`
- **Baseline Value:** `true`
- **Allowed / Scenario Values:** `[true, false]`
- **Minimum:** `false`
- **Maximum:** `true`
- **Source / Evidence:** `SRC-010`, `SRC-011`, `SRC-015`, `T-04`, `T-05`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (Top-level strategy control)
- **Downstream Dependencies:** `visitor_count`, `signup_rate`, `active_free_customers`
- **Editable by User:** `YES`
- **Implementation Status:** `IMPLEMENTED` (Configured in prototype `Plans/Index.vue`)
- **Notes:** Disabling this lever models a paid-only product acquisition model.

#### `pro_tier_location_cap`
- **Display Name:** Pro Plan Location Entitlement Cap
- **Domain:** `PRODUCT`
- **Description:** Maximum number of active commercial locations an account on the Pro tier is permitted to manage.
- **Role:** `CONTROL`
- **Data Type:** `integer`
- **Unit:** `locations/account`
- **Knowledge Status:** `CURRENT & ACCEPTED_BASELINE`
- **Baseline Value:** `3`
- **Allowed / Scenario Values:** `[1, 3]`
- **Minimum:** `1`
- **Maximum:** `3`
- **Source / Evidence:** `ADR-004`, `SRC-011` (`FeatureGateService.php`), `T-05`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (Commercial packaging policy)
- **Downstream Dependencies:** `active_pro_customers`, `arpa`, `arpa_per_location`, `support_burden`
- **Editable by User:** `YES`
- **Implementation Status:** `IMPLEMENTED` (Backend code configures 3; frontend UI copy displays single-location messaging, documented as implementation gap).
- **Notes:** Cannibalization of Business tier is tested as a dynamic simulation hypothesis, not an empirical given.

#### `business_tier_location_cap`
- **Display Name:** Business Plan Location Entitlement Cap
- **Domain:** `PRODUCT`
- **Description:** Maximum number of active commercial branch locations an account on the Business tier is permitted to manage.
- **Role:** `CONTROL`
- **Data Type:** `integer`
- **Unit:** `locations/account`
- **Knowledge Status:** `ACCEPTED_BASELINE`
- **Baseline Value:** `50`
- **Allowed / Scenario Values:** `[5, 10, 50]`
- **Minimum:** `1`
- **Maximum:** `50`
- **Source / Evidence:** `ADR-002`, `SRC-011` (`FeatureGateService.php`), `T-05`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (Commercial packaging policy)
- **Downstream Dependencies:** `average_locations_per_business_account`, `arpa_per_location`, `support_tickets_per_customer`, `database_cost`, `gross_margin_rate`
- **Editable by User:** `YES`
- **Implementation Status:** `PROTOTYPE_GAP` (Backend configures 50; marketing UI displays 5; PRD §14 specifies 10).
- **Notes:** Simulator models the operational stress, database bloat, and margin dilution of 50 locations versus 5 or 10.

#### `trial_duration_days`
- **Display Name:** Pro Trial Duration
- **Domain:** `PRODUCT`
- **Description:** Duration in calendar days of the full-featured Pro tier evaluation granted to eligible users.
- **Role:** `CONSTANT`
- **Data Type:** `integer`
- **Unit:** `days`
- **Knowledge Status:** `CURRENT & ACCEPTED_BASELINE`
- **Baseline Value:** `30`
- **Allowed / Scenario Values:** `[14, 30]`
- **Minimum:** `7`
- **Maximum:** `60`
- **Source / Evidence:** `SRC-007` (PRD §7), `SRC-012` (`PlanController.php`), `T-02`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (Product constant)
- **Downstream Dependencies:** `trial_user_count`, `trial_to_paid_conversion_rate`
- **Editable by User:** `NO`
- **Implementation Status:** `IMPLEMENTED` (Hardcoded 30 days in `PlanController::startTrial`).
- **Notes:** Stable reference constant governing the evaluation cohort maturity window.

#### `trial_activation_trigger`
- **Display Name:** Pro Trial Activation Trigger Mechanism
- **Domain:** `PRODUCT`
- **Description:** Determines whether a 30-day Pro trial activates automatically upon onboarding completion or requires explicit user opt-in action.
- **Role:** `CONTROL`
- **Data Type:** `enum`
- **Unit:** `enum`
- **Knowledge Status:** `CURRENT & ACCEPTED_BASELINE`
- **Baseline Value:** `EXPLICIT`
- **Allowed / Scenario Values:** `[EXPLICIT, AUTOMATIC]`
- **Minimum:** N/A
- **Maximum:** N/A
- **Source / Evidence:** `ADR-003`, `SRC-012` (`PlanController.php`), `T-02`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (User journey policy)
- **Downstream Dependencies:** `trial_start_rate`, `trial_user_count`, `trial_to_paid_conversion_rate`
- **Editable by User:** `YES`
- **Implementation Status:** `IMPLEMENTED` (Snapshot code requires explicit activation; automatic trial preserved as growth scenario).
- **Notes:** `EXPLICIT` yields higher intent cohorts; `AUTOMATIC` produces larger cohort volume with lower conversion intent.

#### `free_history_retention_mode`
- **Display Name:** Free Tier Historical Data Retention Mode
- **Domain:** `PRODUCT`
- **Description:** Data retention policy governing historical billing entry access for Free tier accounts.
- **Role:** `CONTROL`
- **Data Type:** `enum`
- **Unit:** `enum`
- **Knowledge Status:** `ACCEPTED_BASELINE / TARGET`
- **Baseline Value:** `ROLLING_3_MONTH_WINDOW`
- **Allowed / Scenario Values:** `[ROLLING_3_MONTH_WINDOW, HARD_3_ENTRY_LIFETIME_CAP]`
- **Minimum:** N/A
- **Maximum:** N/A
- **Source / Evidence:** `ADR-005`, `SRC-010`, `SRC-020`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (Product data retention policy)
- **Downstream Dependencies:** `active_free_customers`, `data_completeness_score`, `monthly_account_churn_rate`
- **Editable by User:** `YES`
- **Implementation Status:** `PROTOTYPE_GAP` (Current prototype snapshot code enforces `count >= 3` lifetime cap; rolling 3-month window is canonical target baseline).
- **Notes:** Prototype implementation gap documented; lifetime cap preserved as paywall friction stress test.

#### `free_recommendation_gating_mode`
- **Display Name:** Free Tier Recommendation Gating Mode
- **Domain:** `PRODUCT`
- **Description:** Governs which energy-saving inspection recommendations are unblurred and visible to accounts on the Free plan.
- **Role:** `CONTROL`
- **Data Type:** `enum`
- **Unit:** `enum`
- **Knowledge Status:** `CURRENT & SIMULATION`
- **Baseline Value:** `TOP_3_ANY_CATEGORY`
- **Allowed / Scenario Values:** `[TOP_3_ANY_CATEGORY, DATA_COMPLETENESS_ALERTS_ONLY]`
- **Minimum:** N/A
- **Maximum:** N/A
- **Source / Evidence:** `SRC-007` (PRD §14), `SRC-014` (`RecommendationController.php`), `T-08`, `C-012`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (Product feature gating)
- **Downstream Dependencies:** `trial_start_rate`, `trial_to_paid_conversion_rate`
- **Editable by User:** `YES`
- **Implementation Status:** `IMPLEMENTED` (Prototype implements `TOP_3_ANY_CATEGORY`; `DATA_COMPLETENESS_ALERTS_ONLY` is PRD alternative).
- **Notes:** Tests value exposure against upgrade urgency.

---

### Domain 2: PRICING

#### `pro_price_monthly`
- **Display Name:** Pro Plan Monthly Subscription Price
- **Domain:** `PRICING`
- **Description:** Flat monthly subscription fee charged for a Pro plan account.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `CURRENT` (UI Display) / `HYPOTHESIS` (WTP)
- **Baseline Value:** `49000.0`
- **Allowed / Scenario Values:** `[29000.0, 49000.0, 79000.0]`
- **Minimum:** `10000.0`
- **Maximum:** `200000.0`
- **Source / Evidence:** `SRC-015` (`Plans/Index.vue`), `T-04`, `FIN-PRICING`
- **Confidence:** `HIGH` (as displayed pilot price) / `UNKNOWN` (as market equilibrium)
- **Upstream Dependencies:** None (Commercial pricing decision)
- **Downstream Dependencies:** `pro_mrr`, `arpa`, `trial_to_paid_conversion_rate`
- **Editable by User:** `YES`
- **Implementation Status:** `IMPLEMENTED` (UI copy displays Rp49.000; payment gateway not yet live).
- **Notes:** Intended to trigger impulsive conversion below 1 room's single daily electricity waste.

#### `business_price_monthly`
- **Display Name:** Business Plan Monthly Subscription Price
- **Domain:** `PRICING`
- **Description:** Flat monthly subscription fee charged for a multi-location Business plan account.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `CURRENT` (UI Display) / `HYPOTHESIS` (WTP)
- **Baseline Value:** `149000.0`
- **Allowed / Scenario Values:** `[99000.0, 149000.0, 249000.0]`
- **Minimum:** `50000.0`
- **Maximum:** `1000000.0`
- **Source / Evidence:** `SRC-015` (`Plans/Index.vue`), `T-04`, `FIN-PRICING`
- **Confidence:** `HIGH` (as displayed pilot price) / `UNKNOWN` (as market equilibrium)
- **Upstream Dependencies:** None (Commercial pricing decision)
- **Downstream Dependencies:** `business_mrr`, `arpa`, `arpa_per_location`, `gross_margin_rate`
- **Editable by User:** `YES`
- **Implementation Status:** `IMPLEMENTED` (UI copy displays Rp149.000; payment gateway not yet live).
- **Notes:** Flat fee introduces margin dilution as branch count scales toward 50.

---

### Domain 3: CUSTOMER_JOURNEY

#### `visitor_count`
- **Display Name:** Monthly Unique Web Visitors
- **Domain:** `CUSTOMER_JOURNEY`
- **Description:** Total unique prospective commercial users visiting the landing page or portal per month.
- **Role:** `INPUT`
- **Data Type:** `integer`
- **Unit:** `visitors/month`
- **Knowledge Status:** `UNKNOWN / SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [200, 1000, 5000]`
- **Minimum:** `0`
- **Maximum:** `100000`
- **Source / Evidence:** `SRC-005`, `C-008`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `marketing_spend`, `referral_rate`
- **Downstream Dependencies:** `signup_count`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Top-of-pipe traffic volume. No verified production web analytics logged.

#### `signup_rate`
- **Display Name:** Visitor to Signup Conversion Rate
- **Domain:** `CUSTOMER_JOURNEY`
- **Description:** Ratio of unique site visitors who initiate account registration.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `HYPOTHESIS / SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.02, 0.05, 0.10]`
- **Minimum:** `0.001`
- **Maximum:** `0.30`
- **Source / Evidence:** `SRC-005`, `C-008`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `free_plan_enabled`
- **Downstream Dependencies:** `signup_count`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Assumes frictionless registration via credentials.

#### `signup_count`
- **Display Name:** Monthly New Signups
- **Domain:** `CUSTOMER_JOURNEY`
- **Description:** Aggregate number of user accounts registered in a simulation month.
- **Role:** `DERIVED`
- **Data Type:** `integer`
- **Unit:** `users/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `50000`
- **Source / Evidence:** Funnel identity (`visitor_count * signup_rate`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `visitor_count`, `signup_rate`
- **Downstream Dependencies:** `onboarded_user_count`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Intermediate funnel state.

#### `onboarding_completion_rate`
- **Display Name:** Onboarding Completion Rate
- **Domain:** `CUSTOMER_JOURNEY`
- **Description:** Proportion of registered signups who complete business profile setup and enter their first electricity bill.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `SOURCE_BACKED_TARGET / SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `SOURCE_BACKED_TARGET [0.30 (Conservative), 0.50 (Pilot Baseline), 0.60 (PRD §15 Target), 0.85 (Optimistic Target)]`
- **Minimum:** `0.10`
- **Maximum:** `0.95`
- **Source / Evidence:** `SRC-005`, `SRC-007` (PRD §15), `C-008`
- **Confidence:** `LOW`
- **Upstream Dependencies:** None (Product UX friction parameter)
- **Downstream Dependencies:** `onboarded_user_count`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Values 0.50, 0.60, 0.85 are source-backed targets from PRD §15 and Brief S00, not realized customer conversion. Major drop-off expected if manual meter entry friction is high.

#### `onboarded_user_count`
- **Display Name:** Monthly Onboarded Users
- **Domain:** `CUSTOMER_JOURNEY`
- **Description:** Count of users completing profile setup and initial utility baseline entry per month.
- **Role:** `DERIVED`
- **Data Type:** `integer`
- **Unit:** `users/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `50000`
- **Source / Evidence:** Funnel identity (`signup_count * onboarding_completion_rate`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `signup_count`, `onboarding_completion_rate`
- **Downstream Dependencies:** `trial_user_count`, `active_free_customers`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Qualified activated user base.

#### `trial_start_rate`
- **Display Name:** Trial Initiation Rate
- **Domain:** `CUSTOMER_JOURNEY`
- **Description:** Ratio of onboarded users who enter the 30-day Pro trial.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.10, 0.25, 0.50, 1.00]`
- **Minimum:** `0.05`
- **Maximum:** `1.00`
- **Source / Evidence:** `ADR-003`, `SRC-007`, `C-004`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `trial_activation_trigger`, `free_recommendation_gating_mode`
- **Downstream Dependencies:** `trial_user_count`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. 1.00 represents theoretical automatic trial trigger scenario; 0.25 is an unvalidated illustrative hypothesis. Governed directly by `trial_activation_trigger` policy.

#### `trial_user_count`
- **Display Name:** Active Trial Cohort Size
- **Domain:** `CUSTOMER_JOURNEY`
- **Description:** Number of users currently undergoing an active 30-day Pro evaluation.
- **Role:** `STATE`
- **Data Type:** `integer`
- **Unit:** `users`
- **Knowledge Status:** `STATE_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `25000`
- **Source / Evidence:** Discrete-event cohort tracking
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `onboarded_user_count`, `trial_start_rate`, `trial_duration_days`
- **Downstream Dependencies:** `new_paid_customer_count`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** State variable representing mature cohort awaiting conversion decision.

#### `trial_to_paid_conversion_rate`
- **Display Name:** Trial-to-Paid Conversion Rate
- **Domain:** `CUSTOMER_JOURNEY`
- **Description:** Proportion of trial users completing their 30-day evaluation who transition into paying subscribers.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `SOURCE_BACKED_TARGET / SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `SOURCE_BACKED_TARGET [0.01 (Pessimistic), 0.02 (Conservative), 0.03 (PRD §15 Target), 0.05 (Optimistic Target), 0.10 (Brief S00 Stretch)]`
- **Minimum:** `0.005`
- **Maximum:** `0.25`
- **Source / Evidence:** `ADR-003`, `SRC-005`, `SRC-007`, `SRC-022`, `C-008`
- **Confidence:** `LOW` (Zero verified paid transactions in snapshot)
- **Upstream Dependencies:** `pro_price_monthly`, `trial_activation_trigger`, `forecast_confidence`, `data_quality_score`
- **Downstream Dependencies:** `new_paid_customer_count`, `cac`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Primary monetization hurdle. Zero verified paid transactions in snapshot (SRC-022 missing). 0.03 and 0.10 are unvalidated aspirational targets. Sensitive to perceived forecasting utility and trial intent.

---

### Domain 4: GROWTH

#### `leads`
- **Display Name:** Monthly Inbound & Outreach Leads
- **Domain:** `GROWTH`
- **Description:** Raw volume of commercial business leads contacted through direct outreach, partner associations, and digital campaigns.
- **Role:** `INPUT`
- **Data Type:** `integer`
- **Unit:** `leads/month`
- **Knowledge Status:** `SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [20, 100, 500]`
- **Minimum:** `0`
- **Maximum:** `10000`
- **Source / Evidence:** `SRC-005`, `Business/GTM`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `marketing_spend`
- **Downstream Dependencies:** `qualified_leads`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Unvalidated direct outreach channel.

#### `qualified_leads`
- **Display Name:** Marketing/Sales Qualified Leads (MQL)
- **Domain:** `GROWTH`
- **Description:** Leads meeting the Ideal Customer Profile (ICP) criteria (commercial SME, electricity spend > Rp2.000.000/month).
- **Role:** `DERIVED`
- **Data Type:** `integer`
- **Unit:** `leads/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `5000`
- **Source / Evidence:** `Business/Customer-Segments`
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `leads`
- **Downstream Dependencies:** `visitor_count`, `new_paid_customer_count`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Assumes commercial electricity profile filter.

#### `sales_conversion_rate`
- **Display Name:** Direct Sales Conversion Rate
- **Domain:** `GROWTH`
- **Description:** Success rate of founder-led or direct sales outreach in converting qualified leads directly to paid or high-intent pilot status.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `HYPOTHESIS / SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.05, 0.15, 0.30]`
- **Minimum:** `0.01`
- **Maximum:** `0.50`
- **Source / Evidence:** `SRC-005`, `Business/GTM`
- **Confidence:** `LOW`
- **Upstream Dependencies:** None (Sales execution parameter)
- **Downstream Dependencies:** `new_paid_customer_count`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Reflects founder-led sales efficiency during early pilot phase.

#### `referral_rate`
- **Display Name:** Monthly Customer Referral Rate
- **Domain:** `GROWTH`
- **Description:** Percentage of existing active customer accounts that successfully introduce a new registered customer each month.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `HYPOTHESIS / SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.00, 0.02, 0.05]`
- **Minimum:** `0.00`
- **Maximum:** `0.20`
- **Source / Evidence:** `SRC-005`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `data_quality_score`, `forecast_confidence`
- **Downstream Dependencies:** `visitor_count`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Organic word-of-mouth multiplier driven by product usefulness.

---

### Domain 5: GTM

#### `marketing_spend`
- **Display Name:** Monthly Marketing & Acquisition Spend
- **Domain:** `GTM`
- **Description:** Total monthly discretionary budget allocated to digital marketing, search/social ads, and founder sales outreach.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.0, 2000000.0, 10000000.0]`
- **Minimum:** `0.0`
- **Maximum:** `50000000.0`
- **Source / Evidence:** `SRC-005`, `Finance/Financial-Assumptions`
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `cash_balance` (budget ceiling)
- **Downstream Dependencies:** `visitor_count`, `leads`, `marketing_cost`, `cac`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Primary growth lever in venture scaling scenarios. Level 3 missing marketing ledger (`SRC-021`).

#### `cac`
- **Display Name:** Customer Acquisition Cost (Blended CAC)
- **Domain:** `GTM`
- **Description:** Fully loaded sales and marketing expense required to secure one new paying subscriber.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/paid_customer`
- **Knowledge Status:** `UNKNOWN / SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN` (Dynamically derived from `marketing_spend / new_paid_customer_count`)
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `5000000.0`
- **Source / Evidence:** `Finance/Unit-Economics`, `SRC-021` (missing), `SRC-022` (missing)
- **Confidence:** `UNKNOWN`
- **Upstream Dependencies:** `marketing_spend`, `new_paid_customer_count`
- **Downstream Dependencies:** `cash_runway_months`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Level 3 missing financial truth. Critical parameter for venture viability testing.

---

### Domain 6: RETENTION

#### `monthly_account_churn_rate`
- **Display Name:** Monthly Account Churn Rate
- **Domain:** `RETENTION`
- **Description:** Percentage of active paid customer accounts cancelling, terminating, or failing to renew their subscription in a given month.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `ratio/month`
- **Knowledge Status:** `SOURCE_BACKED_TARGET / SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `SOURCE_BACKED_TARGET [0.03 (Best-in-Class SaaS), 0.05 (Brief S00 Target), 0.08 (Moderate Commercial Churn), 0.15 (Stress Test)]`
- **Minimum:** `0.01`
- **Maximum:** `0.40`
- **Source / Evidence:** `SRC-005`, `C-008`, `Finance/Unit-Economics`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `support_burden`, `forecast_confidence`, `data_quality_score`, `pro_tier_location_cap`
- **Downstream Dependencies:** `churned_customer_count`, `retained_customer_count`, `total_paid_customers`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** **Primary Output: YES.** `empirical_validation_required = YES`. Inversely determines customer lifetime ($1/\text{churn}$). Zero empirical customer lifecycle data in snapshot (`SRC-022` missing). 0.05 is an assumption from Brief S00; 0.15 is a synthetic stress test.

#### `churned_customer_count`
- **Display Name:** Monthly Churned Accounts
- **Domain:** `RETENTION`
- **Description:** Total paid subscriber accounts lost during the current simulation month.
- **Role:** `DERIVED`
- **Data Type:** `integer`
- **Unit:** `customers/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `10000`
- **Source / Evidence:** Cohort decay identity (`total_paid_customers * monthly_account_churn_rate`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `total_paid_customers`, `monthly_account_churn_rate`
- **Downstream Dependencies:** `total_paid_customers`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Deducted from paid subscriber base.

#### `retained_customer_count`
- **Display Name:** Monthly Retained Accounts
- **Domain:** `RETENTION`
- **Description:** Total paid subscriber accounts continuing active paid status from previous month.
- **Role:** `DERIVED`
- **Data Type:** `integer`
- **Unit:** `customers/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `50000`
- **Source / Evidence:** Cohort retention identity (`total_paid_customers - churned_customer_count`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `total_paid_customers`, `churned_customer_count`
- **Downstream Dependencies:** `total_paid_customers`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Base for ongoing MRR.

---

### Domain 7: REVENUE

#### `active_free_customers`
- **Display Name:** Active Free Tier Accounts
- **Domain:** `REVENUE`
- **Description:** Total active accounts currently utilizing the Free tier without paying subscription fees.
- **Role:** `STATE`
- **Data Type:** `integer`
- **Unit:** `customers`
- **Knowledge Status:** `STATE_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `100000`
- **Source / Evidence:** Product state tracking
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `free_plan_enabled`, `onboarded_user_count`, `free_history_retention_mode`
- **Downstream Dependencies:** `arpu`, `database_cost`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Incurs database storage cost while acting as an upgrade pipeline.

#### `active_pro_customers`
- **Display Name:** Active Pro Plan Subscribers
- **Domain:** `REVENUE`
- **Description:** Number of paying accounts currently subscribed to the Pro plan.
- **Role:** `STATE`
- **Data Type:** `integer`
- **Unit:** `customers`
- **Knowledge Status:** `STATE_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `50000`
- **Source / Evidence:** Subscription state machine
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `new_paid_customer_count`, `monthly_account_churn_rate`
- **Downstream Dependencies:** `pro_mrr`, `total_paid_customers`, `support_burden`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Primary driver of initial recurring revenue.

#### `active_business_customers`
- **Display Name:** Active Business Plan Subscribers
- **Domain:** `REVENUE`
- **Description:** Number of multi-location commercial accounts currently subscribed to the Business plan.
- **Role:** `STATE`
- **Data Type:** `integer`
- **Unit:** `customers`
- **Knowledge Status:** `STATE_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `10000`
- **Source / Evidence:** Subscription state machine
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `new_paid_customer_count`, `pro_tier_location_cap`, `monthly_account_churn_rate`
- **Downstream Dependencies:** `business_mrr`, `total_paid_customers`, `average_locations_per_business_account`, `support_burden`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** High ARPA account class with significant operational footprint.

#### `total_paid_customers`
- **Display Name:** Total Paid Subscribers
- **Domain:** `REVENUE`
- **Description:** Aggregate active paying accounts (`active_pro_customers + active_business_customers`).
- **Role:** `STATE`
- **Data Type:** `integer`
- **Unit:** `customers`
- **Knowledge Status:** `STATE_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `60000`
- **Source / Evidence:** Subscription identity
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `active_pro_customers`, `active_business_customers`
- **Downstream Dependencies:** `total_mrr`, `arpu`, `arpa`, `support_burden`, `payment_gateway_cost`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** **Primary Output: YES.** Core operational milestone metric.

#### `new_paid_customer_count`
- **Display Name:** Monthly New Paid Customers
- **Domain:** `REVENUE`
- **Description:** Total newly converted paying customers joining in the simulation month across self-serve trials and direct sales.
- **Role:** `DERIVED`
- **Data Type:** `integer`
- **Unit:** `customers/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative integer
- **Minimum:** `0`
- **Maximum:** `10000`
- **Source / Evidence:** Conversion aggregation (`trial_conversions + sales_conversions`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `trial_user_count`, `trial_to_paid_conversion_rate`, `qualified_leads`, `sales_conversion_rate`
- **Downstream Dependencies:** `cac`, `active_pro_customers`, `active_business_customers`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Driver of monthly MRR growth.

#### `pro_mrr`
- **Display Name:** Pro Tier Monthly Recurring Revenue
- **Domain:** `REVENUE`
- **Description:** Total recurring revenue generated from active Pro subscriptions in a month.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `5000000000.0`
- **Source / Evidence:** Revenue identity (`active_pro_customers * pro_price_monthly`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `active_pro_customers`, `pro_price_monthly`
- **Downstream Dependencies:** `total_mrr`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Pro tier recurring revenue stream.

#### `business_mrr`
- **Display Name:** Business Tier Monthly Recurring Revenue
- **Domain:** `REVENUE`
- **Description:** Total recurring revenue generated from active Business subscriptions in a month.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `5000000000.0`
- **Source / Evidence:** Revenue identity (`active_business_customers * business_price_monthly`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `active_business_customers`, `business_price_monthly`
- **Downstream Dependencies:** `total_mrr`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Commercial portfolio subscription revenue.

#### `total_mrr`
- **Display Name:** Total Monthly Recurring Revenue (MRR)
- **Domain:** `REVENUE`
- **Description:** Aggregate monthly recurring subscription revenue (`pro_mrr + business_mrr`).
- **Role:** `OUTPUT`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `10000000000.0`
- **Source / Evidence:** Primary revenue identity
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `pro_mrr`, `business_mrr`
- **Downstream Dependencies:** `arr`, `arpu`, `arpa`, `gross_profit`, `monthly_burn`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** **Primary Output: YES.** Key top-line business metric.

#### `arr`
- **Display Name:** Annual Run-Rate Revenue (ARR)
- **Domain:** `REVENUE`
- **Description:** Annualized revenue run-rate calculated as `total_mrr * 12`.
- **Role:** `OUTPUT`
- **Data Type:** `float`
- **Unit:** `IDR/year`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `120000000000.0`
- **Source / Evidence:** Financial convention (`total_mrr * 12`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `total_mrr`
- **Downstream Dependencies:** None
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Annualization identity for investor milestone tracking.

#### `arpu`
- **Display Name:** Average Revenue Per User (Blended ARPU)
- **Domain:** `REVENUE`
- **Description:** Average monthly revenue across all registered active customer accounts (`total_mrr / (active_free + total_paid)`).
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/customer/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `500000.0`
- **Source / Evidence:** Blended user monetization identity
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `total_mrr`, `active_free_customers`, `total_paid_customers`
- **Downstream Dependencies:** None
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Diluted by Free tier user volume.

#### `arpa`
- **Display Name:** Average Revenue Per Account (Paid ARPA)
- **Domain:** `REVENUE`
- **Description:** Average monthly subscription revenue generated exclusively per paying account (`total_mrr / total_paid_customers`).
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/paid_customer/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Range between pro_price_monthly and business_price_monthly
- **Minimum:** `29000.0`
- **Maximum:** `249000.0`
- **Source / Evidence:** Paid account monetization identity
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `total_mrr`, `total_paid_customers`
- **Downstream Dependencies:** `gross_margin_rate`, `cac`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Weighted mix of Pro vs Business accounts.

#### `arpa_per_location`
- **Display Name:** Effective ARPA Per Managed Location
- **Domain:** `REVENUE`
- **Description:** Normalized monthly revenue earned per managed business branch (`business_mrr / (active_business_customers * average_locations_per_business_account)`).
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/location/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN` (Under 50 locations: Rp2.980; under 10: Rp14.900; under 5: Rp29.800)
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `1000.0`
- **Maximum:** `149000.0`
- **Source / Evidence:** `ADR-002`, `C-003`, `FIN-PRICING`
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `business_price_monthly`, `average_locations_per_business_account`
- **Downstream Dependencies:** `gross_margin_rate`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Key variable for measuring unit economic dilution under multi-site expansion (C-003).

---

### Domain 8: OPERATIONS

#### `average_locations_per_business_account`
- **Display Name:** Average Locations Per Business Account
- **Domain:** `OPERATIONS`
- **Description:** Mean number of active physical branches or meter locations managed by a single Business subscriber.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `locations/account`
- **Knowledge Status:** `UNKNOWN` (Baseline) / `SIMULATION_ASSUMPTION` (Scenarios)
- **Baseline Value:** `UNKNOWN` (Simulation scenario default: `8.0`)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [1.0, 5.0, 8.0, 25.0, 50.0]`
- **Minimum:** `1.0`
- **Maximum:** `50.0`
- **Source / Evidence:** `ADR-002`, `SRC-011`, `C-003`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `business_tier_location_cap`
- **Downstream Dependencies:** `arpa_per_location`, `support_tickets_per_customer`, `database_cost`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Constrained by `business_tier_location_cap` (50). Zero empirical commercial multi-site accounts live in snapshot.

#### `support_tickets_per_customer`
- **Display Name:** Base Support Ticket Rate Per Account
- **Domain:** `OPERATIONS`
- **Description:** Baseline monthly customer support tickets, onboarding inquiries, and billing assistance requests generated per customer account.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `tickets/customer/month`
- **Knowledge Status:** `UNKNOWN` (Baseline) / `SIMULATION_ASSUMPTION` (Scenarios)
- **Baseline Value:** `UNKNOWN` (Simulation illustrative default: `0.20`)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.05, 0.20, 0.80]`
- **Minimum:** `0.01`
- **Maximum:** `3.0`
- **Source / Evidence:** `SRC-005`, `Finance/Unit-Economics`
- **Confidence:** `LOW`
- **Upstream Dependencies:** None (Operational baseline input)
- **Downstream Dependencies:** `support_burden`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Not actual WattWise historical data. Represents uncalibrated simulation assumption.

#### `support_tickets_per_location`
- **Display Name:** Incremental Support Ticket Rate Per Branch Location
- **Domain:** `OPERATIONS`
- **Description:** Additional monthly operational support tickets created for each supplementary location managed by a multi-site Business account.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `tickets/location/month`
- **Knowledge Status:** `UNKNOWN` (Baseline) / `SIMULATION_ASSUMPTION` (Scenarios)
- **Baseline Value:** `UNKNOWN` (Simulation illustrative default: `0.10`)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.02, 0.10, 0.30]`
- **Minimum:** `0.00`
- **Maximum:** `1.5`
- **Source / Evidence:** `ADR-002`, `C-003`, `Finance/Unit-Economics`
- **Confidence:** `LOW`
- **Upstream Dependencies:** None (Operational baseline input)
- **Downstream Dependencies:** `support_burden`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Not actual WattWise historical data. Drives non-linear support load on Business tier accounts with up to 50 locations.

#### `support_capacity`
- **Display Name:** Monthly Support Resolution Capacity
- **Domain:** `OPERATIONS`
- **Description:** Maximum monthly ticket volume the existing team or founder can effectively handle without service degradation or external hiring.
- **Role:** `CONSTANT`
- **Data Type:** `float`
- **Unit:** `tickets/month`
- **Knowledge Status:** `SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN` (Simulation scenario default: `100.0`)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [50.0, 100.0, 300.0]`
- **Minimum:** `10.0`
- **Maximum:** `2000.0`
- **Source / Evidence:** Operational team capacity model
- **Confidence:** `LOW`
- **Upstream Dependencies:** None (Operational parameter)
- **Downstream Dependencies:** `support_burden`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Not actual WattWise team payroll log. Threshold above which support quality deteriorates, triggering churn feedback.

---

### Domain 9: SUPPORT

#### `support_burden`
- **Display Name:** Support Burden Ratio
- **Domain:** `SUPPORT`
- **Description:** Operational stress index representing generated support ticket demand relative to available resolution capacity (`total_tickets / support_capacity`).
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `10.0`
- **Source / Evidence:** Causal chain in `09_CHANGE_IMPACT` §2
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `total_paid_customers`, `average_locations_per_business_account`, `support_tickets_per_customer`, `support_tickets_per_location`, `support_capacity`
- **Downstream Dependencies:** `monthly_account_churn_rate`, `customer_support_cost`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** **Primary Output: YES.** Values > 1.0 indicate operational overload and trigger retention penalties.

#### `support_cost_per_ticket`
- **Display Name:** Operational Cost Per Support Ticket
- **Domain:** `SUPPORT`
- **Description:** Blended labor, tool, and administrative expense incurred to resolve a single customer support inquiry.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `IDR/ticket`
- **Knowledge Status:** `UNKNOWN` (Baseline) / `SIMULATION_ASSUMPTION` (Scenarios)
- **Baseline Value:** `UNKNOWN` (Simulation illustrative default: `25000.0`)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [10000.0, 25000.0, 60000.0]`
- **Minimum:** `5000.0`
- **Maximum:** `150000.0`
- **Source / Evidence:** `Finance/Unit-Economics`
- **Confidence:** `LOW`
- **Upstream Dependencies:** None (Cost assumption input)
- **Downstream Dependencies:** `monthly_support_cost`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Not actual WattWise accounting data. In early phase, represents founder opportunity cost; later represents support payroll.

#### `monthly_support_cost`
- **Display Name:** Total Monthly Customer Support Cost
- **Domain:** `SUPPORT`
- **Description:** Aggregate monthly financial outlay devoted to customer support and onboarding management.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `50000000.0`
- **Source / Evidence:** Operational cost identity (`total_tickets * support_cost_per_ticket`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `support_cost_per_ticket`, `support_tickets_per_customer`, `support_tickets_per_location`, `total_paid_customers`, `average_locations_per_business_account`
- **Downstream Dependencies:** `customer_support_cost`, `monthly_operating_cost`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Directly reduces gross margin when multi-site burden spikes.

---

### Domain 10: COST

#### `hosting_cost`
- **Display Name:** Cloud Web & App Server Hosting Cost
- **Domain:** `COST`
- **Description:** Base monthly fixed infrastructure cost for web servers, frontend hosting (Vercel), and API runtime.
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `SIMULATION_ASSUMPTION`
- **Baseline Value:** `UNKNOWN` (Simulation scenario default: `350000.0`)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [150000.0, 350000.0, 1000000.0]`
- **Minimum:** `0.0`
- **Maximum:** `10000000.0`
- **Source / Evidence:** Infrastructure baseline estimates (`Finance/Financial-Assumptions`)
- **Confidence:** `LOW`
- **Upstream Dependencies:** None (Fixed infrastructure cost input)
- **Downstream Dependencies:** `monthly_operating_cost`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Not actual WattWise accounting data. Baseline Vercel Pro ($20/mo $\approx$ Rp320.000) or VPS hosting.

#### `database_cost`
- **Display Name:** Database Storage & Query Cost
- **Domain:** `COST`
- **Description:** Monthly database instance, storage, and I/O cost scaling with active customers, locations, and historical bill entries.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `UNKNOWN` (Baseline) / `SIMULATION_ASSUMPTION` (Scaling curve)
- **Baseline Value:** `UNKNOWN` (Simulation scenario default: `200000.0` base + per-location storage curve)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [100000.0, 500000.0, 2000000.0]`
- **Minimum:** `100000.0`
- **Maximum:** `15000000.0`
- **Source / Evidence:** Infrastructure usage scaling hypothesis
- **Confidence:** `LOW`
- **Upstream Dependencies:** `active_free_customers`, `total_paid_customers`, `average_locations_per_business_account`, `free_history_retention_mode`
- **Downstream Dependencies:** `monthly_operating_cost`, `gross_profit`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Not actual WattWise accounting invoice. Database cost grows with multi-location Business accounts and rolling free history.

#### `inference_cost`
- **Display Name:** Cloud AI / Model Inference Cost
- **Domain:** `COST`
- **Description:** Monthly expenditure for cloud GPU/API execution for consumption prediction and recommendation ranking.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `CURRENT & ACCEPTED_BASELINE` (Baseline = 0) / `SIMULATION`
- **Baseline Value:** `0.0`
- **Allowed / Scenario Values:** `[0.0, 500000.0, 2500000.0]`
- **Minimum:** `0.0`
- **Maximum:** `20000000.0`
- **Source / Evidence:** `ADR-006`, `T-06`
- **Confidence:** `HIGH` (Deterministic heuristic runs locally in PHP with Rp0 external API cost)
- **Upstream Dependencies:** `forecast_method`, `forecast_compute_cost`, `total_paid_customers`
- **Downstream Dependencies:** `monthly_operating_cost`, `gross_profit`
- **Editable by User:** `NO`
- **Implementation Status:** `IMPLEMENTED` (Baseline = 0; future ML models introduce GPU costs).
- **Notes:** Current code is pure PHP arithmetic; ML GPU costs are NOT CURRENT and modeled only in future scenarios.

#### `payment_gateway_cost`
- **Display Name:** Payment Processing Fees
- **Domain:** `COST`
- **Description:** Monthly variable fees paid to financial transaction processors (e.g. Midtrans, Xendit).
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `CURRENT` (Baseline = 0) / `SIMULATION`
- **Baseline Value:** `0.0`
- **Allowed / Scenario Values:** Non-negative float (e.g. 1.5% + Rp2.000 per transaction)
- **Minimum:** `0.0`
- **Maximum:** `100000000.0`
- **Source / Evidence:** `SRC-010`, `SRC-015`, `T-04`
- **Confidence:** `HIGH` (Zero automated payment processing currently live in snapshot)
- **Upstream Dependencies:** `total_paid_customers`, `total_mrr`
- **Downstream Dependencies:** `monthly_operating_cost`, `gross_profit`
- **Editable by User:** `NO`
- **Implementation Status:** `IMPLEMENTED` (Rp0 in current snapshot; modeled as transaction fee when gateway enabled).
- **Notes:** COGS deduction directly affecting gross margin.

#### `customer_support_cost`
- **Display Name:** Customer Support COGS
- **Domain:** `COST`
- **Description:** Customer support operational cost assigned as direct service expense.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `50000000.0`
- **Source / Evidence:** `monthly_support_cost` mapping
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `monthly_support_cost`
- **Downstream Dependencies:** `monthly_operating_cost`, `gross_profit`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Direct variable operational cost.

#### `marketing_cost`
- **Display Name:** Monthly Sales & Marketing Expense
- **Domain:** `COST`
- **Description:** Operating cost for commercial growth and marketing campaigns (`marketing_spend`).
- **Role:** `INPUT`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `SIMULATION_INPUT`
- **Baseline Value:** `UNKNOWN` (Simulation default: `2000000.0`)
- **Allowed / Scenario Values:** `[0.0, 2000000.0, 10000000.0]`
- **Minimum:** `0.0`
- **Maximum:** `50000000.0`
- **Source / Evidence:** `marketing_spend` input
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `marketing_spend`
- **Downstream Dependencies:** `monthly_operating_cost`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Operating expense (OpEx), excluded from COGS.

#### `monthly_operating_cost`
- **Display Name:** Total Monthly Operating Cost (OpEx + COGS)
- **Domain:** `COST`
- **Description:** Aggregate monthly venture operational spend (`hosting_cost + database_cost + inference_cost + payment_gateway_cost + customer_support_cost + marketing_cost`).
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `200000000.0`
- **Source / Evidence:** Cost summation identity
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `hosting_cost`, `database_cost`, `inference_cost`, `payment_gateway_cost`, `customer_support_cost`, `marketing_cost`
- **Downstream Dependencies:** `monthly_burn`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Determines venture cash burn rate.

---

### Domain 11: FINANCE

#### `gross_profit`
- **Display Name:** Gross Contribution Profit
- **Domain:** `FINANCE`
- **Description:** Total MRR minus direct Cost of Goods Sold (`database_cost + inference_cost + payment_gateway_cost + customer_support_cost`).
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Float (may be negative if support/db exceeds revenue)
- **Minimum:** `-50000000.0`
- **Maximum:** `10000000000.0`
- **Source / Evidence:** Accounting identity (MRR - COGS)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `total_mrr`, `database_cost`, `inference_cost`, `payment_gateway_cost`, `customer_support_cost`
- **Downstream Dependencies:** `gross_margin_rate`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Tests whether subscription pricing covers variable delivery load.

#### `gross_margin_rate`
- **Display Name:** Gross Margin Rate
- **Domain:** `FINANCE`
- **Description:** Ratio of gross profit to total MRR (`gross_profit / total_mrr`).
- **Role:** `OUTPUT`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN` (Healthy SaaS benchmark: $\ge 0.70$)
- **Allowed / Scenario Values:** Float between -1.0 and 1.0
- **Minimum:** `-2.0`
- **Maximum:** `1.0`
- **Source / Evidence:** Unit economics identity (`FIN-UNIT-ECONOMICS`)
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `gross_profit`, `total_mrr`
- **Downstream Dependencies:** `cash_runway_months`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** **Primary Output: YES.** Key indicator of subscription viability under multi-location stress.

#### `monthly_burn`
- **Display Name:** Monthly Net Cash Burn
- **Domain:** `FINANCE`
- **Description:** Monthly net cash deficit (`monthly_operating_cost - total_mrr`). Negative value indicates cash generation.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/month`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Float
- **Minimum:** `-5000000000.0`
- **Maximum:** `200000000.0`
- **Source / Evidence:** Cash flow identity
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `monthly_operating_cost`, `total_mrr`
- **Downstream Dependencies:** `cash_runway_months`, `cash_balance`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** Net cash outflow rate eroding reserves.

#### `cash_balance`
- **Display Name:** Venture Cash Reserves
- **Domain:** `FINANCE`
- **Description:** Liquid capital reserves available in the venture bank account to fund operations.
- **Role:** `STATE`
- **Data Type:** `float`
- **Unit:** `IDR`
- **Knowledge Status:** `UNKNOWN` (Baseline) / `SIMULATION_ASSUMPTION` (Scenarios)
- **Baseline Value:** `UNKNOWN` (Simulation scenario default: `50000000.0`)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [10000000.0, 50000000.0, 200000000.0]`
- **Minimum:** `0.0`
- **Maximum:** `10000000000.0`
- **Source / Evidence:** Level 3 missing financial model (`SRC-021`)
- **Confidence:** `LOW`
- **Upstream Dependencies:** `monthly_burn` (monthly deduction)
- **Downstream Dependencies:** `cash_runway_months`, `marketing_spend` (budget ceiling)
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Not actual WattWise bank balance ledger. Core solvency reserve; reaching zero triggers venture insolvency.

#### `cash_runway_months`
- **Display Name:** Cash Runway Duration
- **Domain:** `FINANCE`
- **Description:** Estimated months of operational solvency remaining before cash reserves deplete at current burn rate (`cash_balance / monthly_burn`).
- **Role:** `OUTPUT`
- **Data Type:** `float`
- **Unit:** `months`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Non-negative float (or infinite if net profitable)
- **Minimum:** `0.0`
- **Maximum:** `120.0`
- **Source / Evidence:** Financial solvency identity
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `cash_balance`, `monthly_burn`
- **Downstream Dependencies:** None
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** **Primary Output: YES.** Survival countdown for venture defense.

#### `revenue_after_electricity`
- **Display Name:** Revenue After Electricity Expense ("Sisa Pendapatan Setelah Listrik")
- **Domain:** `FINANCE`
- **Description:** Client-facing operational metric for commercial MSMEs: gross monthly revenue minus actual monthly electricity utility expense.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `IDR/business/month`
- **Knowledge Status:** `ACCEPTED_CANONICAL_METRIC`
- **Baseline Value:** Standardized metric (`ADR-008`)
- **Allowed / Scenario Values:** Non-negative float
- **Minimum:** `0.0`
- **Maximum:** `1000000000.0`
- **Source / Evidence:** `ADR-008`, `SRC-014` (`RecommendationService.php`), `SRC-018`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (Client-level input in SaaS decision tool)
- **Downstream Dependencies:** None (Client-level output, not venture cash)
- **Editable by User:** `NO`
- **Implementation Status:** `IMPLEMENTED` (In `RecommendationService.php`).
- **Notes:** **CRITICAL ACCOUNTING DISTINCTION:** This represents micro-business electricity gross contribution. It must NOT be confused with venture gross profit, venture net income, or cash balance! "Sisa Kas Bersih" is permanently retired.

---

### Domain 12: DATA_QUALITY

#### `data_provenance_mode`
- **Display Name:** Data Ingestion Provenance Protocol
- **Domain:** `DATA_QUALITY`
- **Description:** Data ingestion mode dictating whether electricity entries are strictly tagged by provenance source (`RECORDED_METER` vs `ESTIMATED_VALUE`).
- **Role:** `CONTROL`
- **Data Type:** `enum`
- **Unit:** `enum`
- **Knowledge Status:** `ACCEPTED_BASELINE`
- **Baseline Value:** `STRICT_TAGGED`
- **Allowed / Scenario Values:** `[STRICT_TAGGED, UNTAGGED_UNIFORM]`
- **Minimum:** N/A
- **Maximum:** N/A
- **Source / Evidence:** `ADR-007`, `C-011`, `SRC-020`
- **Confidence:** `HIGH`
- **Upstream Dependencies:** None (Data architecture policy)
- **Downstream Dependencies:** `recorded_meter_data_ratio`, `estimated_value_ratio`, `data_quality_score`, `forecast_confidence`
- **Editable by User:** `YES`
- **Implementation Status:** `PROTOTYPE_GAP` (Current SaaS database lacks `is_estimated` flag in `electricity_entries`).
- **Notes:** `STRICT_TAGGED` is mandatory simulator baseline contract; `UNTAGGED_UNIFORM` is degradation stress-test.

#### `recorded_meter_data_ratio`
- **Display Name:** Recorded Physical Meter Data Ratio
- **Domain:** `DATA_QUALITY`
- **Description:** Proportion of customer billing records supported by actual physical meter photographs or exact meter readings.
- **Role:** `STATE`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `UNKNOWN` (Baseline) / `SIMULATION_ASSUMPTION` (Scenarios)
- **Baseline Value:** `UNKNOWN` (Simulation scenario default: `0.80`)
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.20, 0.80, 1.00]`
- **Minimum:** `0.00`
- **Maximum:** `1.00`
- **Source / Evidence:** `ADR-007`, `C-011`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `data_provenance_mode`
- **Downstream Dependencies:** `data_quality_score`
- **Editable by User:** `YES`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Not empirical field data. Higher ratio increases forecast confidence.

#### `estimated_value_ratio`
- **Display Name:** Synthetic / Estimated Data Ratio
- **Domain:** `DATA_QUALITY`
- **Description:** Proportion of customer billing records generated through algorithmic estimation (kWh $\times$ tariff) without verified meter reading.
- **Role:** `STATE`
- **Data Type:** `float`
- **Unit:** `ratio`
- **Knowledge Status:** `STATE_SIMULATION`
- **Baseline Value:** `UNKNOWN` (Complement of recorded meter ratio: `1.0 - recorded_meter_data_ratio`)
- **Allowed / Scenario Values:** `[0.00, 0.20, 0.80]`
- **Minimum:** `0.00`
- **Maximum:** `1.00`
- **Source / Evidence:** `ADR-007`, `T-01`
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `recorded_meter_data_ratio`
- **Downstream Dependencies:** `data_quality_score`, `forecast_error_rate`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** In untagged mode, estimated data quietly degrades downstream forecasting without user awareness.

#### `data_completeness_score`
- **Display Name:** Monthly History Completeness Score
- **Domain:** `DATA_QUALITY`
- **Description:** Metric evaluating continuous sequential monthly billing records (0 to 12 months without gaps).
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `score (0-1)`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Score between 0.0 and 1.0
- **Minimum:** `0.0`
- **Maximum:** `1.0`
- **Source / Evidence:** `ADR-005`, `SRC-013` (`PredictionService.php`), `T-06`
- **Confidence:** `HIGH` (Logic verified in code: <3 months = no trend; $\ge 3$ months = trend heuristic)
- **Upstream Dependencies:** `free_history_retention_mode`
- **Downstream Dependencies:** `data_quality_score`, `forecast_confidence`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** At least 3 contiguous months are required for trend slope in heuristic forecasting.

#### `data_quality_score`
- **Display Name:** Composite Data Quality Index
- **Domain:** `DATA_QUALITY`
- **Description:** Holistic data integrity rating combining provenance tagging, completeness, and volatility variance.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `score (0-1)`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Score between 0.0 and 1.0
- **Minimum:** `0.0`
- **Maximum:** `1.0`
- **Source / Evidence:** `ADR-007`, `09_CHANGE_IMPACT` §2 Chain 3
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `data_provenance_mode`, `recorded_meter_data_ratio`, `data_completeness_score`
- **Downstream Dependencies:** `forecast_confidence`, `trial_to_paid_conversion_rate`, `monthly_account_churn_rate`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** **Primary Output: YES.** Key driver of customer trust and habit retention.

---

### Domain 13: FORECASTING

#### `forecast_method`
- **Display Name:** Electricity Consumption Forecasting Method
- **Domain:** `FORECASTING`
- **Description:** Underlying computational methodology used to forecast next-month electricity consumption.
- **Role:** `CONTROL`
- **Data Type:** `enum`
- **Unit:** `enum`
- **Knowledge Status:** `CURRENT & ACCEPTED_BASELINE`
- **Baseline Value:** `DETERMINISTIC_HEURISTIC`
- **Allowed / Scenario Values:** `[DETERMINISTIC_HEURISTIC, GRADIENT_BOOSTING, LSTM, OTHER_ML]`
- **Minimum:** N/A
- **Maximum:** N/A
- **Source / Evidence:** `ADR-006`, `SRC-013` (`PredictionService.php`), `T-06`
- **Confidence:** `HIGH` (Snapshot code verified 100% deterministic PHP math)
- **Upstream Dependencies:** None (Algorithmic architecture policy)
- **Downstream Dependencies:** `inference_cost`, `forecast_compute_cost`, `forecast_error_rate`, `forecast_confidence`
- **Editable by User:** `YES`
- **Implementation Status:** `IMPLEMENTED` (`DETERMINISTIC_HEURISTIC` is implemented in code; ML variants are NOT CURRENT and modeled only in future scenarios).
- **Notes:** Machine Learning is NOT CURRENT. No GPU costs modeled in baseline.

#### `forecast_error_rate`
- **Display Name:** Forecast Mean Absolute Percentage Error (MAPE)
- **Domain:** `FORECASTING`
- **Description:** Average percentage divergence between forecasted monthly consumption and actual billed kWh.
- **Role:** `STATE`
- **Data Type:** `float`
- **Unit:** `ratio (MAPE)`
- **Knowledge Status:** `UNKNOWN` (Baseline) / `SIMULATION_ASSUMPTION` (Scenarios)
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** `ILLUSTRATIVE_RANGE_PENDING_CALIBRATION [0.04, 0.12, 0.25]`
- **Minimum:** `0.01`
- **Maximum:** `0.80`
- **Source / Evidence:** Level 3 missing empirical test logs, `C-007`
- **Confidence:** `LOW`
- **Upstream Dependencies:** `forecast_method`, `estimated_value_ratio`, `data_completeness_score`
- **Downstream Dependencies:** `forecast_confidence`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** `empirical_validation_required = YES`. Neither 0.12 nor 0.07 is an empirical baseline or proven ML accuracy benchmark; uncalibrated forecasting accuracy in commercial field settings. Machine Learning remains `TARGET / FUTURE / SIMULATION`, not current production reality.

#### `forecast_confidence`
- **Display Name:** Forecast Output Confidence Rating
- **Domain:** `FORECASTING`
- **Description:** Confidence band rating exposed to the user accompanying consumption projections.
- **Role:** `DERIVED`
- **Data Type:** `float`
- **Unit:** `score (0-1)`
- **Knowledge Status:** `DERIVED_SIMULATION`
- **Baseline Value:** `UNKNOWN`
- **Allowed / Scenario Values:** Score between 0.0 and 1.0
- **Minimum:** `0.0`
- **Maximum:** `1.0`
- **Source / Evidence:** `SRC-008`, `SRC-013`, `09_CHANGE_IMPACT` §2
- **Confidence:** `MEDIUM`
- **Upstream Dependencies:** `forecast_method`, `forecast_error_rate`, `data_quality_score`, `data_completeness_score`
- **Downstream Dependencies:** `trial_to_paid_conversion_rate`, `monthly_account_churn_rate`, `referral_rate`
- **Editable by User:** `NO`
- **Implementation Status:** `SIMULATOR_SPEC`
- **Notes:** **Primary Output: YES.** Informs user whether the prediction is reliable.

#### `forecast_compute_cost`
- **Display Name:** Compute Cost Per Forecast Generation
- **Domain:** `FORECASTING`
- **Description:** Computational expense incurred per forecast evaluation run.
- **Role:** `CONSTANT`
- **Data Type:** `float`
- **Unit:** `IDR/forecast`
- **Knowledge Status:** `CURRENT & ACCEPTED_BASELINE` (Baseline = 0) / `SIMULATION`
- **Baseline Value:** `0.0`
- **Allowed / Scenario Values:** `[0.0, 50.0, 500.0]`
- **Minimum:** `0.0`
- **Maximum:** `5000.0`
- **Source / Evidence:** `ADR-006`, `T-06`
- **Confidence:** `HIGH` (Deterministic PHP arithmetic runs in existing thread at Rp0 variable compute)
- **Upstream Dependencies:** `forecast_method`
- **Downstream Dependencies:** `inference_cost`
- **Editable by User:** `NO`
- **Implementation Status:** `IMPLEMENTED` (Rp0 in current baseline; simulation parameter for future cloud ML scenarios).
- **Notes:** Cloud ML models require paid API/GPU calls; heuristic requires none.

---

## 3. Primary Outputs Summary Table

The following 8 variables are flagged as primary outputs for presentation in future simulator scenario interfaces:

| Variable ID | Display Name | Domain | Role | Unit | Key Insight / Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `total_mrr` | Total Monthly Recurring Revenue | REVENUE | OUTPUT | IDR/month | Top-line recurring revenue generated by active customer base. |
| `gross_margin_rate` | Gross Margin Rate | FINANCE | OUTPUT | ratio | Tests whether subscription price covers variable support and data delivery load. |
| `cash_runway_months` | Cash Runway Duration | FINANCE | OUTPUT | months | Solvency countdown tracking remaining months before bank balance depletes. |
| `total_paid_customers` | Total Paid Subscribers | REVENUE | STATE | customers | Volume of commercial enterprises paying monthly recurring fees. |
| `monthly_account_churn_rate` | Monthly Account Churn Rate | RETENTION | INPUT | ratio/month | Customer retention decay rate determining lifetime value and growth hurdle. |
| `support_burden` | Support Burden Ratio | SUPPORT | DERIVED | ratio | Capacity strain indicator alerting when customer service demand exceeds staffing. |
| `forecast_confidence` | Forecast Confidence Rating | FORECASTING | DERIVED | score (0-1) | Measure of algorithmic reliability driving customer trust and perceived utility. |
| `data_quality_score` | Composite Data Quality Index | DATA_QUALITY | DERIVED | score (0-1) | Health index measuring provenance, completeness, and meter verification. |

---

## 4. Unknown Variables & Empirical Gaps Register

In accordance with strict Project Brain governance, the following 10 variables represent critical empirical unknowns in the real-world operating environment. These values are **never guessed or fabricated**; they are parameterized via simulation ranges until empirical evidence is gathered:

| Variable ID | Reason Unknown | Missing Evidence | Simulation Treatment | Resolution Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| `monthly_account_churn_rate` | Zero empirical customer lifecycle data. | Longitudinal paid subscriber payment history (`SRC-022`). | Multi-scenario range: `[0.03, 0.05, 0.08, 0.15]`. | 6+ months live recurring billing logs. |
| `trial_to_paid_conversion_rate` | Zero commercial payment transactions recorded. | Payment gateway logs (`SRC-022`). | Multi-scenario range: `[0.01, 0.02, 0.03, 0.05, 0.10]`. | Live Midtrans/Xendit conversion cohorts. |
| `cac` | No historical paid marketing or sales logs. | Marketing spend ledger and attributed customer records. | Modeled dynamically from spend / conversions. | Documented customer acquisition expenditure. |
| `support_tickets_per_customer` | Zero customer support inquiries or ticketing history in snapshot. | Helpdesk support ticketing software logs (`SRC-022`). | Simulation range: `[0.05, 0.20, 0.80]`. | Customer service ticket logs from live pilot accounts. |
| `support_cost_per_ticket` | Internal team has not logged support resolution hours. | Time-tracking on pilot customer onboarding and support. | Simulation range: `[10000, 25000, 60000]`. | Helpdesk ticket duration and payroll logs. |
| `support_tickets_per_location` | No multi-site customers have operated live. | Ticket logs segmented by customer branch count. | Simulation range: `[0.02, 0.10, 0.30]`. | Empirical pilot data with 5+ branch accounts. |
| `visitor_count` | Production web traffic analytics not tracked. | Google Analytics / Plausible logs for landing page. | Simulation scenarios: `[200, 1000, 5000]`. | Verified web traffic telemetry. |
| `forecast_error_rate` (MAPE) | Heuristic accuracy not benchmarked against commercial meters. | Ground truth commercial interval meter test datasets. | Baseline: `UNKNOWN`; Illustrative scenarios: `[0.04, 0.12, 0.25]` pending calibration. | Commercial meter audit and MAPE benchmark against actual billing logs. |
| `database_cost` | Cloud database bill not broken down per account. | Managed PostgreSQL cloud bill with table storage breakdowns. | Base Rp200.000 + per-location storage curve. | Itemized cloud provider infrastructure invoice. |
| `average_locations_per_business_account` | Zero Business tier customers currently onboarded. | Customer branch registration distribution. | Scenario distribution: `[1.0, 5.0, 8.0, 25.0, 50.0]`. | Registered locations in active Business accounts. |

---

## 5. Prototype Implementation Gaps

The following 7 discrepancies between approved canonical baselines and prototype snapshot code are formally cataloged:

1. **`business_tier_location_cap`:** Accepted baseline is `50` locations (ADR-002, backend `FeatureGateService.php`). Frontend pricing card (`Plans/Index.vue`) displays `5` locations; PRD §14 specifies `10`.
2. **`pro_tier_location_cap`:** Accepted baseline is `3` locations (ADR-004, backend `FeatureGateService.php`). Frontend pricing card displays multi-business excluded (single-business messaging).
3. **`trial_activation_trigger`:** Accepted baseline is `EXPLICIT` (ADR-003, `PlanController::startTrial`). PRD narrative envisions automatic activation upon onboarding completion.
4. **`free_history_retention_mode`:** Accepted baseline is `ROLLING_3_MONTH_WINDOW` (ADR-005). Prototype snapshot code (`ElectricityEntryController.php`) halts users at 3 lifetime entries (`count >= 3`).
5. **`forecast_method`:** Accepted baseline is `DETERMINISTIC_HEURISTIC` (ADR-006, `PredictionService.php`). Legacy README and UI badges describe "Hybrid AI" and ML models.
6. **`data_provenance_mode`:** Accepted baseline is `STRICT_TAGGED` (ADR-007). Prototype database schema (`electricity_entries`) lacks an `is_estimated` flag.
7. **`revenue_after_electricity`:** Standardized canonical metric is `revenue_after_electricity` ("Sisa Pendapatan Setelah Listrik", ADR-008). Historical marketing copy references to "Sisa Kas Bersih" are permanently retired.
