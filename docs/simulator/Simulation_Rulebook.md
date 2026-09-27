---
id: SIM-RULES-001
type: specification
status: CURRENT
owner: Architecture & Simulator Team
phase: Phase 3
confidence: HIGH
last_verified: 2026-09-27
sources:
  - SRC-001
  - SRC-005
  - SRC-010
  - SRC-011
  - SRC-013
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

# WattWise Operating Simulator — Phase 3 Simulation Rulebook

This rulebook is the canonical, binding specification of all mathematical identities, operational formulas, and policy rules executable within the Phase 3 Core Simulation Engine. Every rule implemented in engine code must match a specification defined in this document.

---

## 1. Rule Taxonomy

Every calculation rule belongs to exactly one primary class:

1. **`IDENTITY`:** Mathematical, accounting, or cohort identities with stable definitions (e.g. $Total = Pro + Business$).
2. **`ACCEPTED_POLICY`:** Rules governed by accepted human Architecture Decision Records (ADRs).
3. **`VERIFIED_BEHAVIOR`:** Rules directly supported by verified prototype snapshot behavior.
4. **`MODEL_ASSUMPTION`:** Mathematical approximations reflecting explicit operational assumptions.
5. **`BUSINESS_HYPOTHESIS`:** Behavioral elasticity and growth conversion hypotheses.
6. **`SIMULATION_RELATIONSHIP`:** Parameterized relationships introduced for scenario sensitivity testing.
7. **`DEFERRED_UNKNOWN`:** Known dependencies whose calculation logic is deferred until empirical telemetry is established.

---

## 2. Master Rulebook Catalog

### Domain 1: REVENUE & SUBSCRIBER IDENTITIES

#### `RULE-REV-01`: Pro Monthly Recurring Revenue
- **Rule ID:** `RULE-REV-01`
- **Output Variable:** `pro_mrr`
- **Input Variables:** `active_pro_customers`, `pro_price_monthly`
- **Rule Class:** `IDENTITY`
- **Description:** Calculates monthly recurring subscription revenue generated from active Pro accounts.
- **Expression:**
  $$\text{pro\_mrr} = \text{active\_pro\_customers} \times \text{pro\_price\_monthly}$$
- **Evidence:** `SRC-015` (`Plans/Index.vue`), `FIN-PRICING`
- **Knowledge Status:** Inherits `CURRENT` if inputs are current; `SIMULATION_ASSUMPTION` if customer count is modeled.
- **UNKNOWN Behavior:** If either input is `UNKNOWN`, `pro_mrr = UNKNOWN`.
- **Edge Cases:** If `active_pro_customers == 0`, `pro_mrr = 0.0`.
- **Confidence:** `HIGH`
- **Test Cases:** $100 \times 49,000 = 4,900,000$; $0 \times 49,000 = 0$; $\text{UNKNOWN} \times 49,000 = \text{UNKNOWN}$.

#### `RULE-REV-02`: Business Monthly Recurring Revenue
- **Rule ID:** `RULE-REV-02`
- **Output Variable:** `business_mrr`
- **Input Variables:** `active_business_customers`, `business_price_monthly`
- **Rule Class:** `IDENTITY`
- **Description:** Calculates monthly recurring subscription revenue generated from active Business accounts.
- **Expression:**
  $$\text{business\_mrr} = \text{active\_business\_customers} \times \text{business\_price\_monthly}$$
- **Evidence:** `SRC-015` (`Plans/Index.vue`), `FIN-PRICING`
- **Knowledge Status:** Inherits input status.
- **UNKNOWN Behavior:** If either input is `UNKNOWN`, `business_mrr = UNKNOWN`.
- **Edge Cases:** If `active_business_customers == 0`, `business_mrr = 0.0`.
- **Confidence:** `HIGH`
- **Test Cases:** $10 \times 149,000 = 1,490,000$; $0 \times 149,000 = 0$.

#### `RULE-REV-03`: Total Monthly Recurring Revenue
- **Rule ID:** `RULE-REV-03`
- **Output Variable:** `total_mrr`
- **Input Variables:** `pro_mrr`, `business_mrr`
- **Rule Class:** `IDENTITY`
- **Description:** Sum of recurring revenue across all commercial tiers.
- **Expression:**
  $$\text{total\_mrr} = \text{pro\_mrr} + \text{business\_mrr}$$
- **Evidence:** Standard SaaS revenue identity.
- **Knowledge Status:** Inherits lowest input status.
- **UNKNOWN Behavior:** If either input is `UNKNOWN`, `total_mrr = UNKNOWN`.
- **Confidence:** `HIGH`
- **Test Cases:** $4,900,000 + 1,490,000 = 6,390,000$.

#### `RULE-REV-04`: Annual Recurring Revenue (ARR)
- **Rule ID:** `RULE-REV-04`
- **Output Variable:** `arr`
- **Input Variables:** `total_mrr`
- **Rule Class:** `IDENTITY`
- **Description:** Annualized run-rate of current MRR.
- **Expression:**
  $$\text{arr} = \text{total\_mrr} \times 12$$
- **Evidence:** Standard SaaS accounting definition.
- **Knowledge Status:** Same as `total_mrr`.
- **UNKNOWN Behavior:** If `total_mrr` is `UNKNOWN`, `arr = UNKNOWN`.
- **Confidence:** `HIGH`
- **Test Cases:** $1,000,000 \times 12 = 12,000,000$.

#### `RULE-REV-05`: Total Paid Customers
- **Rule ID:** `RULE-REV-05`
- **Output Variable:** `total_paid_customers`
- **Input Variables:** `active_pro_customers`, `active_business_customers`
- **Rule Class:** `IDENTITY`
- **Description:** Total active subscriber accounts paying recurring subscriptions.
- **Expression:**
  $$\text{total\_paid\_customers} = \text{active\_pro\_customers} + \text{active\_business\_customers}$$
- **Evidence:** Customer account aggregation identity.
- **Knowledge Status:** Inherits input status.
- **UNKNOWN Behavior:** If either is `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `HIGH`
- **Test Cases:** $100 + 10 = 110$.

#### `RULE-REV-06`: Average Revenue Per Account (ARPA)
- **Rule ID:** `RULE-REV-06`
- **Output Variable:** `arpa`
- **Input Variables:** `total_mrr`, `total_paid_customers`
- **Rule Class:** `IDENTITY`
- **Description:** Blended monthly revenue per paying customer account.
- **Expression:**
  $$\text{arpa} = \begin{cases} 0.0 & \text{if } \text{total\_paid\_customers} = 0 \\ \frac{\text{total\_mrr}}{\text{total\_paid\_customers}} & \text{otherwise} \end{cases}$$
- **Evidence:** Unit economics identity (`Finance/Unit-Economics`).
- **Knowledge Status:** Inherits lowest input status.
- **UNKNOWN Behavior:** If either is `UNKNOWN`, output is `UNKNOWN`.
- **Edge Cases:** If `total_paid_customers == 0`, `arpa = 0.0` (prevents division by zero).
- **Confidence:** `HIGH`
- **Test Cases:** $4,900,000 / 100 = 49,000$; $0 / 0 = 0.0$.

#### `RULE-REV-07`: ARPA Per Branch Location
- **Rule ID:** `RULE-REV-07`
- **Output Variable:** `arpa_per_location`
- **Input Variables:** `business_mrr`, `active_business_customers`, `average_locations_per_business_account`
- **Rule Class:** `MODEL_ASSUMPTION`
- **Description:** Average monthly revenue earned per managed physical location under flat Business tier pricing.
- **Expression:**
  $$\text{total\_biz\_locations} = \text{active\_business\_customers} \times \text{average\_locations\_per_business\_account}$$
  $$\text{arpa\_per\_location} = \begin{cases} 0.0 & \text{if } \text{total\_biz\_locations} = 0 \\ \frac{\text{business\_mrr}}{\text{total\_biz\_locations}} & \text{otherwise} \end{cases}$$
- **Evidence:** `ADR-002`, `C-003`.
- **Knowledge Status:** `SIMULATION_ASSUMPTION` (since average location count is an uncalibrated empirical unknown).
- **UNKNOWN Behavior:** If `average_locations_per_business_account` is `UNKNOWN`, `arpa_per_location = UNKNOWN`.
- **Confidence:** `MEDIUM`
- **Test Cases:** Business MRR Rp149.000 for 1 customer with 50 locations $\implies$ Rp2.980/location.

---

### Domain 2: CUSTOMER GROWTH & FUNNEL RULES

#### `RULE-FUN-01`: Registered Account Signups
- **Rule ID:** `RULE-FUN-01`
- **Output Variable:** `signup_count`
- **Input Variables:** `visitor_count`, `signup_rate`
- **Rule Class:** `MODEL_ASSUMPTION`
- **Description:** Expected value of new user registrations generated from landing page visitors.
- **Expression:**
  $$\text{signup\_count} = \text{visitor\_count} \times \text{signup\_rate}$$
- **Evidence:** Standard marketing funnel definition.
- **Knowledge Status:** `SIMULATION_ASSUMPTION` (unless visitor traffic is empirically verified).
- **UNKNOWN Behavior:** If `visitor_count` is `UNKNOWN` or `signup_rate` is `UNKNOWN`, `signup_count = UNKNOWN`.
- **Confidence:** `MEDIUM`
- **Test Cases:** $1000 \times 0.08 = 80.0$; $\text{UNKNOWN} \times 0.08 = \text{UNKNOWN}$.

#### `RULE-FUN-02`: Onboarded Account Activations
- **Rule ID:** `RULE-FUN-02`
- **Output Variable:** `onboarded_user_count`
- **Input Variables:** `signup_count`, `onboarding_completion_rate`
- **Rule Class:** `MODEL_ASSUMPTION`
- **Description:** Expected accounts successfully finishing profile setup, tariff configuration, and initial bill entry.
- **Expression:**
  $$\text{onboarded\_user\_count} = \text{signup\_count} \times \text{onboarding\_completion\_rate}$$
- **Evidence:** PRD §15.
- **Knowledge Status:** Inherits input status.
- **UNKNOWN Behavior:** If either is `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `MEDIUM`
- **Test Cases:** $80 \times 0.50 = 40.0$.

#### `RULE-FUN-03`: Pro Trial Starters
- **Rule ID:** `RULE-FUN-03`
- **Output Variable:** `trial_user_count`
- **Input Variables:** `onboarded_user_count`, `trial_start_rate`
- **Rule Class:** `MODEL_ASSUMPTION`
- **Description:** Activated accounts explicitly opting into the 30-day Pro trial.
- **Expression:**
  $$\text{trial\_user\_count} = \text{onboarded\_user\_count} \times \text{trial\_start\_rate}$$
- **Evidence:** `ADR-003` (`PlanController::startTrial`).
- **Knowledge Status:** Inherits input status.
- **UNKNOWN Behavior:** If either is `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `MEDIUM`
- **Test Cases:** $40 \times 0.25 = 10.0$.

#### `RULE-FUN-04`: New Paid Subscriber Cohort
- **Rule ID:** `RULE-FUN-04`
- **Output Variable:** `new_paid_customer_count`
- **Input Variables:** `trial_user_count`, `trial_to_paid_conversion_rate`, `leads`, `sales_conversion_rate`
- **Rule Class:** `IDENTITY`
- **Description:** Total new paying subscribers converted from product trials and direct outbound sales.
- **Expression:**
  $$\text{trial\_conversions} = \text{trial\_user\_count} \times \text{trial\_to\_paid\_conversion\_rate}$$
  $$\text{sales\_conversions} = \text{leads} \times \text{sales\_conversion\_rate}$$
  $$\text{new\_paid\_customer\_count} = \text{trial\_conversions} + \text{sales\_conversions}$$
- **Evidence:** Acquisition aggregation model.
- **Knowledge Status:** `SIMULATION_ASSUMPTION` or `HYPOTHESIS`.
- **UNKNOWN Behavior:** If required conversion inputs are `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `MEDIUM`
- **Test Cases:** $(10 \times 0.05) + (20 \times 0.15) = 0.5 + 3.0 = 3.5$.

---

### Domain 3: RETENTION & CHURN DYNAMICS

#### `RULE-RET-01`: Monthly Customer Churn
- **Rule ID:** `RULE-RET-01`
- **Output Variable:** `churned_customer_count`
- **Input Variables:** `total_paid_customers`, `monthly_account_churn_rate`
- **Rule Class:** `MODEL_ASSUMPTION`
- **Description:** Number of paying subscriber accounts lost during the monthly cycle.
- **Expression:**
  $$\text{churned\_customer\_count} = \text{total\_paid\_customers} \times \text{monthly\_account\_churn\_rate}$$
- **Evidence:** Cohort decay identity.
- **Knowledge Status:** `SIMULATION_ASSUMPTION` (since churn rate is an empirical unknown).
- **UNKNOWN Behavior:** If `monthly_account_churn_rate` is `UNKNOWN`, `churned_customer_count = UNKNOWN`.
- **Confidence:** `MEDIUM`
- **Test Cases:** $100 \times 0.05 = 5.0$.

#### `RULE-RET-02`: Retained Paid Customers
- **Rule ID:** `RULE-RET-02`
- **Output Variable:** `retained_customer_count`
- **Input Variables:** `total_paid_customers`, `churned_customer_count`
- **Rule Class:** `IDENTITY`
- **Description:** Paying accounts continuing subscription into the subsequent cycle.
- **Expression:**
  $$\text{retained\_customer\_count} = \max(0.0, \text{total\_paid\_customers} - \text{churned\_customer\_count})$$
- **Evidence:** Standard customer cohort identity.
- **Knowledge Status:** Inherits input status.
- **UNKNOWN Behavior:** If either is `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `HIGH`
- **Test Cases:** $100 - 5 = 95$.

---

### Domain 4: OPERATIONS & SUPPORT BURDEN

#### `RULE-OPS-01`: Support Burden Ratio
- **Rule ID:** `RULE-OPS-01`
- **Output Variable:** `support_burden`
- **Input Variables:** `total_paid_customers`, `active_business_customers`, `average_locations_per_business_account`, `support_tickets_per_customer`, `support_tickets_per_location`, `support_capacity`
- **Rule Class:** `MODEL_ASSUMPTION`
- **Description:** Ratio of incoming support inquiries relative to sustainable monthly team capacity.
- **Expression:**
  $$\text{base\_tickets} = \text{total\_paid\_customers} \times \text{support\_tickets\_per\_customer}$$
  $$\text{extra\_locations} = \max(0.0, \text{average\_locations\_per_business\_account} - 1.0)$$
  $$\text{loc\_tickets} = \text{active\_business\_customers} \times \text{extra\_locations} \times \text{support\_tickets\_per\_location}$$
  $$\text{total\_tickets} = \text{base\_tickets} + \text{loc\_tickets}$$
  $$\text{support\_burden} = \begin{cases} 0.0 & \text{if } \text{support\_capacity} \le 0 \\ \frac{\text{total\_tickets}}{\text{support\_capacity}} & \text{otherwise} \end{cases}$$
- **Evidence:** `ADR-002`, `09_CHANGE_IMPACT` §2.
- **Knowledge Status:** `SIMULATION_ASSUMPTION`.
- **UNKNOWN Behavior:** If ticket rates or capacity are `UNKNOWN`, `support_burden = UNKNOWN`.
- **Confidence:** `MEDIUM`
- **Test Cases:** 100 base tickets, 100 capacity $\implies 1.0$.

#### `RULE-OPS-02`: Monthly Customer Support Labor Cost
- **Rule ID:** `RULE-OPS-02`
- **Output Variable:** `customer_support_cost`
- **Input Variables:** `total_paid_customers`, `active_business_customers`, `average_locations_per_business_account`, `support_tickets_per_customer`, `support_tickets_per_location`, `support_cost_per_ticket`
- **Rule Class:** `MODEL_ASSUMPTION`
- **Description:** Aggregate direct labor cost to resolve monthly customer support tickets.
- **Expression:**
  $$\text{customer\_support\_cost} = \text{total\_tickets} \times \text{support\_cost\_per\_ticket}$$
- **Evidence:** `Finance/Unit-Economics`.
- **Knowledge Status:** `SIMULATION_ASSUMPTION`.
- **UNKNOWN Behavior:** If `support_cost_per_ticket` is `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `LOW`
- **Test Cases:** 20 tickets $\times$ Rp25.000 = Rp500.000.

---

### Domain 5: COSTS, MARGINS & SOLVENCY

#### `RULE-CST-01`: Cost of Goods Sold (COGS)
- **Rule ID:** `RULE-CST-01`
- **Output Variable:** `cogs`
- **Input Variables:** `hosting_cost`, `database_cost`, `inference_cost`, `payment_gateway_cost`, `customer_support_cost`
- **Rule Class:** `IDENTITY`
- **Description:** Direct costs directly attributable to software delivery and subscriber servicing.
- **Expression:**
  $$\text{cogs} = \text{hosting\_cost} + \text{database\_cost} + \text{inference\_cost} + \text{payment\_gateway\_cost} + \text{customer\_support\_cost}$$
- **Evidence:** SaaS standard accounting classification.
- **Knowledge Status:** Lowest input status.
- **UNKNOWN Behavior:** If mandatory cost components are `UNKNOWN`, `cogs = UNKNOWN`.
- **Confidence:** `HIGH`
- **Test Cases:** $350,000 + 200,000 + 0 + 0 + 500,000 = 1,050,000$.

#### `RULE-CST-02`: Startup Gross Profit
- **Rule ID:** `RULE-CST-02`
- **Output Variable:** `gross_profit`
- **Input Variables:** `total_mrr`, `cogs`
- **Rule Class:** `IDENTITY`
- **Description:** Revenue remaining after deducting direct software service and support costs.
- **Expression:**
  $$\text{gross\_profit} = \text{total\_mrr} - \text{cogs}$$
- **Evidence:** Standard gross profit identity.
- **Knowledge Status:** Lowest input status.
- **UNKNOWN Behavior:** If either is `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `HIGH`
- **Test Cases:** $6,390,000 - 1,050,000 = 5,340,000$.

#### `RULE-CST-03`: Startup Gross Margin Rate
- **Rule ID:** `RULE-CST-03`
- **Output Variable:** `gross_margin_rate`
- **Input Variables:** `gross_profit`, `total_mrr`
- **Rule Class:** `IDENTITY`
- **Description:** Percentage of recurring revenue converted into gross margin.
- **Expression:**
  $$\text{gross\_margin\_rate} = \begin{cases} 0.0 & \text{if } \text{total\_mrr} \le 0 \\ \frac{\text{gross\_profit}}{\text{total\_mrr}} & \text{otherwise} \end{cases}$$
- **Evidence:** Standard financial margin identity.
- **Knowledge Status:** Lowest input status.
- **UNKNOWN Behavior:** If either is `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `HIGH`
- **Test Cases:** $5,340,000 / 6,390,000 \approx 0.8356$ (83.6%).

#### `RULE-CST-04`: Monthly Cash Burn
- **Rule ID:** `RULE-CST-04`
- **Output Variable:** `monthly_burn`
- **Input Variables:** `cogs`, `marketing_spend`, `total_mrr`
- **Rule Class:** `IDENTITY`
- **Description:** Net monthly cash deficit eroding venture reserves.
- **Expression:**
  $$\text{monthly\_operating\_cost} = \text{cogs} + \text{marketing\_spend}$$
  $$\text{monthly\_burn} = \text{monthly\_operating\_cost} - \text{total\_mrr}$$
- **Evidence:** Startup solvency identity.
- **Knowledge Status:** Lowest input status.
- **UNKNOWN Behavior:** If any input is `UNKNOWN`, output is `UNKNOWN`.
- **Confidence:** `HIGH`
- **Test Cases:** $(1,050,000 + 2,000,000) - 1,500,000 = 1,550,000$.

#### `RULE-CST-05`: Cash Runway Duration
- **Rule ID:** `RULE-CST-05`
- **Output Variable:** `cash_runway_months`
- **Input Variables:** `cash_balance`, `monthly_burn`
- **Rule Class:** `IDENTITY`
- **Description:** Estimated months until cash depletion at current burn rate.
- **Expression:**
  $$\text{cash\_runway\_months} = \begin{cases} 
  \text{Infinity} & \text{if } \text{monthly\_burn} \le 0 \\
  \frac{\text{cash\_balance}}{\text{monthly\_burn}} & \text{otherwise}
  \end{cases}$$
- **Evidence:** Standard venture runway formula.
- **Knowledge Status:** Lowest input status.
- **UNKNOWN Behavior:** If `cash_balance` is `UNKNOWN` or `monthly_burn` is `UNKNOWN`, `cash_runway_months = UNKNOWN` (with explicit explanation).
- **Confidence:** `HIGH`
- **Test Cases:** $50,000,000 / 2,000,000 = 25.0 \text{ months}$; $\text{monthly\_burn} \le 0 \implies \text{Infinity}$.

---

### Domain 6: FINANCIAL SEPARATION ENFORCEMENT

#### `RULE-SEP-01`: Customer Revenue After Electricity (Decoupled)
- **Rule ID:** `RULE-SEP-01`
- **Output Variable:** `revenue_after_electricity`
- **Input Variables:** `customer_gross_revenue`, `customer_electricity_bill`
- **Rule Class:** `ACCEPTED_POLICY`
- **Description:** Client commercial unit economics metric measuring operating surplus after electricity expenses.
- **Expression:**
  $$\text{revenue\_after\_electricity} = \text{customer\_gross\_revenue} - \text{customer\_electricity\_bill}$$
- **Evidence:** `ADR-008`.
- **Knowledge Status:** `ACCEPTED_CANONICAL_METRIC`.
- **UNKNOWN Behavior:** If inputs are unknown, output is `UNKNOWN`.
- **Critical Architectural Boundary:** This metric belongs strictly to the **customer's** business economics. It MUST NEVER be added to, mixed with, or treated as WattWise startup revenue (`total_mrr`, `arr`, `gross_profit`).
- **Confidence:** `HIGH`
- **Test Cases:** Client revenue Rp50.000.000, electricity Rp4.000.000 $\implies$ Rp46.000.000.

---

### Domain 7: INTER-TICK STATE TRANSITION RULES

#### `TRANS-01`: Cash Balance Solvency Carryover
- **Rule ID:** `TRANS-01`
- **Output Variable:** `cash_balance` (at tick $t \ge 1$)
- **Input Variables:** `cash_balance` (at $t-1$), `monthly_burn` (at $t-1$)
- **Rule Class:** `IDENTITY`
- **Description:** Solvency balance continuity deducting preceding month's net cash burn from reserves.
- **Expression:**
  $$\text{cash\_balance}(t) = \max(0, \text{cash\_balance}(t-1) - \text{monthly\_burn}(t-1))$$
- **UNKNOWN Behavior:** If either $\text{cash\_balance}(t-1)$ or $\text{monthly\_burn}(t-1)$ is `UNKNOWN`, $\text{cash\_balance}(t) = \text{UNKNOWN}$ with provenance `INTER_TICK_CASH_FLOW`. It is strictly forbidden to coerce `UNKNOWN` to $0$ or evaluate partial differences.

#### `TRANS-02`: Customer Cohort Aging & Carryover
- **Rule ID:** `TRANS-02`
- **Output Variables:** `active_pro_customers`, `active_business_customers` (at tick $t \ge 1$)
- **Input Variables:** `retained_customer_count` (at $t-1$), `new_paid_customer_count` (at $t-1$)
- **Rule Class:** `MODEL_ASSUMPTION`
- **Description:** Subscriber continuity carrying over retained accounts plus newly acquired paying accounts, allocated proportionally across tiers based on prior customer mix.
- **UNKNOWN Behavior:** If $\text{retained\_customer\_count}(t-1)$ is `UNKNOWN` (e.g. churn rate lacks empirical calibration), active subscriber counts for tick $t$ evaluate strictly to `UNKNOWN` with provenance `COHORT_AGING_TRANSITION`.

