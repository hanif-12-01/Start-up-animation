---
id: SIM-UIA-001
type: specification
status: CURRENT
owner: Architecture & Simulator Team
phase: Phase 4A
confidence: HIGH
last_verified: 2026-09-27
sources:
  - SRC-001
  - SRC-005
  - SRC-007
  - SRC-010
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

# WattWise Operating Simulator — UI Information Architecture
## Phase 4A UI Architecture & Design System

This document defines the authoritative Information Architecture (IA) and user navigation model for the interactive simulator interface of the [[Engine_Architecture|WattWise Operating Simulator]]. It bridges the formal model cataloged in the [[Variable_Dictionary]] and the deterministic computational logic formalized in the [[Simulation_Rulebook]] into an intuitive, decision-oriented user experience.

---

## 1. Core Simulator Philosophy & User Loop

### 1.1 Decision Simulator, Not a Passive Dashboard
The WattWise Operating Simulator is **not** an operational business intelligence dashboard. It is an interactive startup strategy simulator designed to answer critical venture questions:
- *"What happens to solvency if monthly churn is 8% instead of 3%?"*
- *"What is the financial and operational trade-off of raising the Pro tier location cap to 5?"*
- *"Which outputs are based on verified code vs. unvalidated empirical assumptions?"*
- *"Why is cash runway UNKNOWN under the current scenario?"*

### 1.2 The Canonical Interaction Loop
The user interface is structured around a continuous 8-step decision loop:

```
┌──────────────────────────────────────────────────────────────┐
│                    THE CANONICAL USER LOOP                   │
└──────────────────────────────────────────────────────────────┘
                               │
                      [1. SELECT SCENARIO]
                               │
                       [2. EDIT INPUTS]
                               │
                    [3. VALIDATE CONTROLS]
                               │
                    [4. RUN ENGINE (EXECUTE)]
                               │
                      [5. VIEW RESULTS]
                               │
                 [6. INSPECT CAUSES (TRACE)]
                               │
                    [7. COMPARE SCENARIOS]
                               │
                    [8. ADJUST DECISION]
                               │
                               └───────────► (Loop back to Step 2)
```

---

## 2. Persistent Application Shell

The simulator employs a fixed-viewport persistent shell optimized for competition demos and deep-dive operational analysis:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: Brand Logo │ Scenario Selector │ Run Engine Button │ Status Badge   │
├────────────────────┬─────────────────────────────────────────────────────────┤
│ SIDEBAR            │ MAIN LAB WORKSPACE                                      │
│                    │                                                         │
│ ◈ Command Center   │ [Lab Header & Context Summary]                          │
│ ▤ Product Lab      │ ─────────────────────────────────────────────────────── │
│ ↗ Growth & GTM Lab │ [Scenario Control Levers & Variable Cards]              │
│ ⛁ Financial Lab    │ ─────────────────────────────────────────────────────── │
│ ⚙ Operations Lab   │ [Visualizations / Primary Metric Cards / Data Tables]   │
│ ⚠ Incident Lab     │                                                         │
│                    │                                                         │
├────────────────────┴─────────────────────────────────────────────────────────┤
│ BOTTOM TIMELINE TRAY: Scrubber (M0...M12) │ Play/Pause │ Provenance Trigger  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Top Bar (Global Controls & Identity)
- **Project Identity:** WattWise Operating Simulator branding with canonical repository link.
- **Scenario Selector:** Dropdown permitting quick-switch between Canonical Baseline, Conservative Venture Defense, Aggressive Multi-Branch Growth, and Custom Scenarios.
- **Global Actions:**
  - `Run Simulation` button (triggers execution via [[UI_Engine_Contract]]).
  - `Reset to Baseline` button (reverts all active overrides).
  - `Compare Mode` toggle (enables dual-run delta comparison).
- **Run Status Indicator:** Live state badge (`IDLE`, `EDITED`, `RUNNING`, `SUCCESS`, `UNKNOWN_PRESENT`, `ERROR`).

### 2.2 Sidebar Navigation (Domain-Aligned Labs)
The sidebar groups the 67 variables into 6 focused functional labs reflecting the natural divisions of startup leadership:
1. **Command Center (Overview):** High-level venture health, solvency gauge, and executive summary.
2. **Product Lab:** Packaging policies, location caps, gating rules, and data retention.
3. **Growth & GTM Lab:** Top-of-funnel traffic, onboarding friction, trial throughput, and customer acquisition cost.
4. **Financial Lab:** Unit economics, recurring revenue, COGS, cash burn, and customer economic decoupling.
5. **Operations & Support Lab:** Multi-location commercial density, support burden index, and infrastructure costs.
6. **Incident Lab:** Stress-test scenario presets modeling operational crises and tail risks.

### 2.3 Main Lab Workspace
Dedicated container for the active lab. Divided horizontally into:
- **Lab Header:** Operational focus statement, epistemic warning banner, and active scenario overrides badge.
- **Scenario Levers Section:** Curated interactive controls for human-editable variables belonging to that lab's domain.
- **Outputs & Trajectories Section:** Real-time metrics, trendlines, and diagnostic panels driven strictly by engine results.

### 2.4 Bottom Timeline & Context Tray
- **Month Scrubber:** Horizontal navigation bar allowing discrete time travel from Month $0$ to Month $12$.
- **Playback Controls:** `Step Backward`, `Play/Pause`, `Step Forward`, `Reset to M0`.
- **Epistemic Context Counter:** Instant count of active overrides, empirical unknowns, and ADR-locked baselines.
- **Execution Trace Drawer Trigger:** Opens the "Why This Result?" slide-out panel.

---

## 3. Detailed Lab Architecture

### 3.1 Lab A: Overview / Command Center
- **Purpose:** Provide an instantaneous holistic assessment of enterprise solvency, traction, and data integrity.
- **Mapped Variables & Engine Outputs:**
  - **Primary Metric Cards:** `total_mrr`, `arr`, `total_paid_customers`, `cash_balance`, `cash_runway_months`, `gross_margin_rate`, `support_burden`, `forecast_confidence`.
  - **Solvency Gauge:** Visual countdown bar displaying remaining runway in months before bank balance depletion.
  - **Model Health Matrix:** Real-time count of variables currently evaluated as `CURRENT`, `SIMULATION_ASSUMPTION`, and `UNKNOWN`.
  - **Active Scenario Summary:** List of all non-default parameter overrides applied to the active run.

### 3.2 Lab B: Product Lab
- **Purpose:** Analyze the commercial, cannibalization, and support consequences of product tier packaging and entitlement policies.
- **Core Strategy Levers:**
  - `business_tier_location_cap`: Baseline = `50` ([[Decisions/ADR-002-business-tier-location-entitlement|ADR-002]]); allowed overrides: `[5, 10, 50]`.
  - `pro_tier_location_cap`: Baseline = `3` ([[Decisions/ADR-004-pro-tier-location-entitlement|ADR-004]]); allowed overrides: `[1, 3]`.
  - `trial_activation_trigger`: Baseline = `EXPLICIT` ([[Decisions/ADR-003-trial-activation-mechanism|ADR-003]]); alternative: `AUTOMATIC`.
  - `free_history_retention_mode`: Baseline = `ROLLING_3_MONTH_WINDOW` ([[Decisions/ADR-005-free-tier-history-retention-policy|ADR-005]]); alternative: `HARD_3_ENTRY_LIFETIME_CAP`.
  - `free_recommendation_gating_mode`: Baseline = `TOP_3_ANY_CATEGORY`; alternative: `DATA_COMPLETENESS_ALERTS_ONLY`.
  - `forecast_method`: Baseline = `DETERMINISTIC_HEURISTIC` ([[Decisions/ADR-006-forecasting-methodology-and-ai-positioning|ADR-006]]); alternatives: `[GRADIENT_BOOSTING, LSTM, OTHER_ML]`.
  - `data_provenance_mode`: Baseline = `STRICT_TAGGED` ([[Decisions/ADR-007-data-provenance-and-estimation-labeling|ADR-007]]); alternative: `UNTAGGED_SILENT_ESTIMATION`.
- **Visual Distinction:** ADR-locked baselines feature a permanent blue/slate lock badge. Simulation alternatives display an illustrative hypothesis indicator.
- **Primary Diagnostics:** Shows downstream cannibalization warnings and data quality scores.

### 3.3 Lab C: Growth & GTM Lab
- **Purpose:** Model customer acquisition dynamics, conversion friction, and marketing capital efficiency.
- **Core Growth Levers:**
  - `visitor_count`: Baseline = `UNKNOWN` (Empirical Unknown #7); scenario brackets: `[200, 1000, 5000]`.
  - `signup_rate`: Scenario range `[0.02, 0.05, 0.10]`.
  - `onboarding_completion_rate`: PRD target `[0.50, 0.60, 0.85]`.
  - `trial_start_rate`: Explicit opt-in rate `[0.10, 0.25, 0.70]`.
  - `trial_to_paid_conversion_rate`: Baseline = `UNKNOWN` (Empirical Unknown #2); scenario range: `[0.01, 0.03, 0.10]`.
  - `marketing_spend`: Discretionary monthly expenditure `[0, 2000000, 10000000]`.
  - `leads` & `sales_conversion_rate`: Direct commercial outreach channels.
  - `monthly_account_churn_rate`: Baseline = `UNKNOWN` (Empirical Unknown #1); scenario range: `[0.03, 0.05, 0.08, 0.15]`.
- **Primary Diagnostics:**
  - **Funnel Throughput Cascade:** Sankey/waterfall diagram illustrating expected-value conversions from visitors $\to$ signups $\to$ onboarded users $\to$ trials $\to$ paid subscribers.
  - **Acquisition Unit Economics:** Dynamic Customer Acquisition Cost (`cac`) plotted against Customer Lifetime Value ($1 / \text{churn}$).

### 3.4 Lab D: Financial Lab
- **Purpose:** Inspect recurring revenue streams, operating cost structure, gross margins, and runway duration.
- **Core Financial Levers:**
  - `pro_price_monthly`: Baseline = `49000` (Source-backed displayed price `SRC-015`).
  - `business_price_monthly`: Baseline = `149000` (Source-backed displayed price `SRC-015`).
  - `cash_balance`: Initial reserves `[30000000, 50000000, 100000000]`.
- **Primary Financial Visualizations:**
  - **Revenue Mix Chart:** Stacked monthly series comparing `pro_mrr` vs `business_mrr`.
  - **Cost Breakdown Waterfall:** Hosting (`hosting_cost`), database (`database_cost`), customer support (`customer_support_cost`), payment gateway (`payment_gateway_cost`), and marketing spend.
  - **Solvency Countdown Chart:** Trajectory of `cash_balance` across the horizon, showing exact month of zero-cash crossing if burn exceeds revenues.
- **Strict Decoupling Boundary (ADR-008):**
  - The customer commercial unit economics metric `revenue_after_electricity` is sequestered in an isolated **"Client Impact & Proof-of-Value"** panel. It is visually, semantically, and structurally barred from appearing in startup MRR, ARR, or gross profit totals.

### 3.5 Lab E: Operations & Support Lab
- **Purpose:** Stress-test operational capacity, support desk payroll load, and infrastructure scaling curves.
- **Core Operations Levers:**
  - `average_locations_per_business_account`: Baseline = `UNKNOWN` (Empirical Unknown #10); brackets `[1, 5, 8, 25, 50]`.
  - `support_tickets_per_customer`: Baseline = `UNKNOWN` (Empirical Unknown #4); brackets `[0.05, 0.20, 0.80]`.
  - `support_tickets_per_location`: Baseline = `UNKNOWN` (Empirical Unknown #6); brackets `[0.02, 0.10, 0.30]`.
  - `support_cost_per_ticket`: Baseline = `UNKNOWN` (Empirical Unknown #5); brackets `[10000, 25000, 60000]`.
  - `support_capacity`: Monthly ticket threshold `[50, 120, 300]`.
  - `database_cost`: Baseline = `UNKNOWN` (Empirical Unknown #9); base Rp200.000 + per-location storage curve.
- **Primary Diagnostics:**
  - **Support Capacity Thermometer:** Visual indicator displaying `support_burden` ($> 1.0$ indicates quality degradation and elevated churn risk).
  - **Margin Dilution Curve:** Graphic showing how accounts scaling toward 50 locations dilute ARPA per location and strain variable gross margins.

### 3.6 Lab F: Incident Lab (Stress-Test Vectors)
- **Purpose:** Explore enterprise resilience under acute operational and market shocks.
- **Engine-Mapped Incident Vectors:**
  1. *Support Desk Collapse:* Sudden surge in `support_tickets_per_customer` exceeding `support_capacity`, driving churn from $3\%$ to $15\%$.
  2. *Commercial Multi-Branch Database Explosion:* Rapid onboarding of Business accounts with 50 locations each, escalating `database_cost` and depressing gross margin.
  3. *Uncalibrated Machine Learning Cost Inflation:* Switching `forecast_method` to `GRADIENT_BOOSTING` / `LSTM` incurring Rp50–500 per forecast compute cost without offsetting conversion gains.
  4. *Low Data Quality Trust Erosion:* Untagged meter estimates degrading `data_quality_score` below $0.50$, stalling trial-to-paid conversion.
  5. *Venture Solvency Squeeze:* Stagnant organic traffic coupled with high initial burn, testing runway extension strategies.
- **Architecture Constraint:** All incidents execute solely by injecting validated scenario overrides into the existing deterministic engine. No hidden formulas or arbitrary scripts are introduced in the UI.

---

## 4. Scenario Lifecycle & Comparison Architecture

### 4.1 Scenario Lifecycle States

```
┌──────────────┐     Select Template     ┌─────────────────┐
│ CANONICAL    │ ──────────────────────► │ SCENARIO LOADED │
│ BASELINE     │                         │ (All Defaults)  │
└──────────────┘                         └────────┬────────┘
                                                  │
                                          Edit Parameter
                                                  ▼
┌──────────────┐      Reset Action       ┌─────────────────┐
│ ENGINE       │ ◄────────────────────── │ DIRTY / EDITED  │
│ EXECUTION    │                         │ (Overrides Map) │
└──────┬───────┘                         └────────┬────────┘
       │                                          │
       │ Engine Returns Result                    │ User clicks Run
       ▼                                          ▼
┌──────────────────────┐                 ┌─────────────────┐
│ ACTIVE RUN VIEW      │                 │ VALIDATING      │
│ (Ticks 0..N Cached)  │                 │ CONTROLS        │
└──────┬───────────────┘                 └─────────────────┘
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
┌──────────────────────┐       ┌───────────────────────┐
│ SINGLE RUN INSPECT   │       │ SIDE-BY-SIDE COMPARE  │
│ (Timeline + Traces)  │       │ (Delta vs Baseline)   │
└──────────────────────┘       └───────────────────────┘
```

### 4.2 Comparison Mode Architecture
- **Dual-State Evaluation:** When Compare Mode is active, the simulator maintains two run results in memory:
  - `Baseline Scenario` (or Scenario A)
  - `Experimental Scenario` (Scenario B)
- **Visual Delta Indicators:** Output cards display absolute and percentage differences ($\Delta \text{MRR}$, $\Delta \text{Runway}$, $\Delta \text{Support Burden}$).
- **Trade-Off Matrix:** Tabular comparison highlighting trade-offs rather than simplistic "better/worse" verdicts:
  - *Example:* "Scenario B yields +Rp12.4M ARR, but compresses runway by 3.2 months and increases support burden by 45%."

---

## 5. Timeline Navigation & Discrete Time UX

### 5.1 Tick Model ($1 \text{ tick} = 1 \text{ month}$)
- The simulator operates on discrete monthly ticks ($t = 0, 1, 2, \dots, H$).
- $t = 0$ represents the initial enterprise conditions (month 0 seed state).
- $t \ge 1$ represents sequential deterministic state transitions resulting from inter-tick cash flows and customer cohort aging.

### 5.2 Timeline Scrubber Controls
- **Scrubber Slider:** Direct random-access scrubbing across the horizon.
- **Step Buttons:** Advance or regress by exactly 1 simulation month.
- **Play / Pause:** Auto-step through the horizon at configurable speeds (500ms, 1000ms, 2000ms per tick) to observe dynamic solvency burn and customer accumulation.
- **Horizon Selector:** Quick toggles for 6 months (Venture Defense horizon) vs 12 months (Scale Stress horizon).

---

## 6. Progressive Disclosure & Audience Modes

To serve both executive decision-makers and technical model auditors, the interface supports two progressive complexity levels:

| Feature / Element | Decision Mode (Default) | Model Engineer / Audit Mode |
| :--- | :--- | :--- |
| **Primary Audience** | Founders, Investors, Pitch Judges | Model Developers, System Architects |
| **Metric Cards** | Top-line results, solvency, runway | Full 67-variable state inspectability |
| **Variable Controls** | Curated high-impact levers (12 variables) | Complete dictionary of 20 input levers |
| **Trace Visibility** | Plain-English summary ("Why this result?") | Full mathematical DAG trace with rule IDs |
| **Epistemic Badges** | Simplified (Verified vs Assumed vs Unknown) | Full 6-level Project Brain taxonomy |
| **Calculations** | Hidden inside Core Simulation Engine | Mathematical identities visible in drawer |

---

## Related Documents

- [[Engine_Architecture]]
- [[Simulation_Rulebook]]
- [[Variable_Dictionary]]
- [[Dependency-Map]]
- [[Phase_3_Test_Matrix]]
- [[UI_Engine_Contract]]
- [[UI_Design_System]]
- [[UI_Component_Architecture]]
- [[UI_Wireframes]]
- [[Phase_4B_Implementation_Plan]]
