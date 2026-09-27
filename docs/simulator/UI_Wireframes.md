# UI Wireframes & Layout Specifications
**WattWise Operating Simulator — Phase 4A UI Architecture**
*Status: Phase 4A Specification / Canonical Architecture*
*Relates to: [[UI_Information_Architecture]], [[UI_Engine_Contract]], [[UI_Design_System]], [[UI_Component_Architecture]], [[Variable_Dictionary]]*

> [!NOTE]
> All numerical values, prices, and percentages shown in these ASCII wireframes are **UI MOCK VALUES / ILLUSTRATIVE ONLY** intended solely to demonstrate structural layout, hierarchy, and epistemic labeling. They do not constitute verified business data or changes to Current Truth.

---

## 1. AppShell & Persistent Frame Wireframe

The AppShell maintains persistent top navigation, an epistemic legend, workspace container, and a docked timeline tray.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [WW LOGO] WattWise Operating Simulator  v1.0.0-rc1                 [Scenario: Default Baseline ▼] [RUN] │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  TopBar Status:  [● Engine: IDLE]   [3 Overrides Active]   [Standard Mode | Expert Mode]   [Help/Docs] │
├──────────────┬─────────────────────────────────────────────────────────────────────────────────────────┤
│ NAVIGATION   │ WORKSPACE / ACTIVE LAB                                                                  │
│              │                                                                                         │
│ [Overview]   │  Lab Header: Financial Lab                                                              │
│ [Product]    │  Scope: Startup Economics, Runway, Burn & Unit Margins                                  │
│ [Growth/GTM] │  Epistemic Balance: [4 Current] [2 Assumptions] [1 Unknown]                             │
│ [Finance]    │ ─────────────────────────────────────────────────────────────────────────────────────── │
│ [Operations] │                                                                                         │
│ [Incident]   │  [Active Lab Content Area - See Specific Lab Wireframes Below]                          │
│              │                                                                                         │
│ ──────────── │                                                                                         │
│ [⊞ Compare]  │                                                                                         │
│              │                                                                                         │
│ EPISTEMIC    │                                                                                         │
│ LEGEND:      │                                                                                         │
│ ● Current    │                                                                                         │
│ ▲ Assumption │                                                                                         │
│ ? Unknown    │                                                                                         │
│ ⚑ Target     │                                                                                         │
├──────────────┴─────────────────────────────────────────────────────────────────────────────────────────┤
│ TIMELINE TRAY:                                                                                         │
│ [◀ Prev] [▶ Play] [Next ▶]   Month: [M00] ──●── [M01] ──── [M02] ──── [M03] ──── [M06] ──── [M12]      │
│ Scrub Tick: Month 3 of 12    | Active Tick Outputs: 14 Valid, 2 Assumptions, 1 Unknown                 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Overview / Command Center Wireframe (`OverviewLabView`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ COMMAND CENTER (OVERVIEW)                                                                              │
│ Scenario: Default Baseline  |  Last Run: Just Now  |  Horizon: 12 Months                               │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ HERO METRIC TILES                                                                                      │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ ┌─────────────────────────┐ │
│ │ TOTAL MRR            │ │ PAID CUSTOMERS       │ │ NET MONTHLY BURN     │ │ CASH RUNWAY             │ │
│ │ Rp14,700,000         │ │ 300                  │ │ (Rp3,850,000)        │ │ 15.6 Months             │ │
│ │ ● CURRENT BASELINE   │ │ ▲ SIMULATION ASSUMPT │ │ ▲ SIMULATION ASSUMPT │ │ ▲ SIMULATION ASSUMPT    │ │
│ │ [Why this result?]   │ │ [Why this result?]   │ │ [Why this result?]   │ │ [Why this result?]      │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ └─────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TRAJECTORY PROJECTION SUMMARY (12-MONTH HORIZON)                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ ┌────────────────────────────────┐ │
│ │ Cash Balance & Burn Over Time (Native SVG Spark-Chart)          │ │ Scenario Epistemic Health      │ │
│ │ Rp                                                              │ │                                │ │
│ │ 60M ───┐                                                        │ │ Total Variables: 67            │ │
│ │        └───┐                                                    │ │ ■ Baseline (Current): 42 (63%) │ │
│ │ 30M        └───┐                                                │ │ ▲ Assumptions:       18 (27%) │ │
│ │                └───● [M12: Rp24.2M]                             │ │ ? Empirical Unknowns: 7 (10%)  │ │
│ │  0M ───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───┼───             │ │                                │ │
│ │       M0  M1  M2  M3  M4  M5  M6  M7  M8  M9 M10 M11 M12        │ │ [Inspect Unknowns (7)]         │ │
│ └─────────────────────────────────────────────────────────────────┘ └────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ QUICK-TUNING DRAWER (HIGH-SENSITIVITY CONTROLS)                                                        │
│ [▼ Collapse Controls]                                                                                  │
│ • Monthly Churn Rate:     [   8.0% ] ──[Slider: 0% - 25%]──  (▲ Assumption | ADR-Locked baseline)      │
│ • Starter Plan Price:     [ Rp29,000 ] (● Current Price | ADR-002)                                     │
│ • Pro Plan Price:         [ Rp49,000 ] (● Current Price | ADR-002)                                     │
│ • Marketing Spend (Mo):   [ Rp5,000,000 ] (▲ Assumption | Free variable)                               │
│ [Reset to Defaults]                                                         [Run Simulation with Tuning]│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Product Lab Wireframe (`ProductLabView`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PRODUCT LAB                                                                                            │
│ Objective: Explore plan packaging limits, feature tiering, and location cap economics                   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PLAN PACKAGING & LOCATION CAPS                                                                         │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌────────────────────────────────────────┐ │
│ │ STARTER TIER              │ │ PRO TIER                  │ │ BUSINESS TIER                          │ │
│ ├───────────────────────────┤ ├───────────────────────────┤ ├────────────────────────────────────────┤ │
│ │ Monthly Price:            │ │ Monthly Price:            │ │ Monthly Price:                         │ │
│ │   Rp29,000 (● ADR-002)    │ │   Rp49,000 (● ADR-002)    │ │   Rp99,000 (● ADR-002)                 │ │
│ │                           │ │                           │ │                                        │ │
│ │ Location Cap:             │ │ Location Cap:             │ │ Location Cap:                          │ │
│ │   [ 1 ] Location (Locked) │ │   [ 3 ] Locations (Max)   │ │   [ 10 ] Locations (Max)               │ │
│ │                           │ │   (● ADR-003 Baseline)    │ │   (● ADR-003 Baseline)                 │ │
│ │ Recommendation Engine:    │ │ Recommendation Engine:    │ │ Recommendation Engine:                 │ │
│ │   [✕] Disabled            │ │   [✓] Enabled             │ │   [✓] Enabled                          │ │
│ │                           │ │   (● ADR-004 Gated)       │ │   (● ADR-004 Gated)                    │ │
│ └───────────────────────────┘ └───────────────────────────┘ └────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SIMULATION ALTERNATIVE OVERRIDES                                                                       │
│ • Pro Location Cap Override:      [ 5 ] (▲ Simulation Alternative | Baseline is 3)                     │
│ • Recommendation Gated on Starter:[ Toggle: OFF ] (▲ Simulation Alternative | Baseline is Gated)       │
│ • Trial History Horizon:          [ 30 ] Days (● Baseline is 30 Days)                                  │
│                                                                                                        │
│ ESTIMATED POLICY IMPACT (Engine Computed):                                                             │
│  ARPA (Average Revenue Per Account): Rp42,300   Gross Margin Impact: +1.4%                             │
│  [Why this result?]                                                         [Apply & Re-run Simulation]│
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Growth / GTM Lab Wireframe (`GrowthLabView`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ GROWTH / GTM LAB                                                                                       │
│ Objective: Model acquisition funnel conversion, lead volume, and customer retention dynamics          │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ACQUISITION CONVERSION FUNNEL (Native SVG Stepped Funnel)                                              │
│                                                                                                        │
│   [ 10,000 Visitors ] ─────────── (▲ Simulation Assumption: Monthly Organic/Paid)                      │
│         │ (2.5% Conversion)                                                                            │
│         ▼                                                                                              │
│   [   250 Signups ] ───────────── (▲ Simulation Assumption: Account Registrations)                     │
│         │ (60.0% Completion)                                                                           │
│         ▼                                                                                              │
│   [   150 Trial Starts ] ──────── (▲ Simulation Assumption: 14-Day Free Trials)                        │
│         │ (? Empirical Benchmark Unknown: Trial-to-Paid Conversion)                                    │
│         ▼                                                                                              │
│   [    30 Paid Customers ] ────── (? Derived Output: Active Conversions)                              │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TUNABLE GROWTH VARIABLES                                                                               │
│ ┌──────────────────────────────────────────────┐ ┌───────────────────────────────────────────────────┐ │
│ │ Top-of-Funnel & Marketing Controls           │ │ Retention & Expansion Controls                    │ │
│ ├──────────────────────────────────────────────┤ ├───────────────────────────────────────────────────┤ │
│ │ • Monthly Marketing Spend:                   │ │ • Monthly Customer Churn Rate:                    │ │
│ │   [ Rp5,000,000 ] (▲ Assumption)             │ │   [ 8.0% ] ──[Slider]── (▲ Simulation Assumption) │ │
│ │ • Blended CAC (Derived):                     │ │ • Expansion Revenue Rate:                         │ │
│ │   Rp166,667 / customer [Why?]                │ │   [ 0.0% ] (▲ Baseline Assumption)                │ │
│ │ • Trial Card Required:                       │ │                                                   │ │
│ │   [ Toggle: OFF ] (● Baseline: Cardless)     │ │ [?] NOTICE: Churn benchmark is an uncalibrated    │ │
│ │                                              │ │ simulation assumption. Real churn is UNKNOWN.     │ │
│ └──────────────────────────────────────────────┘ └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Financial Lab Wireframe (`FinancialLabView`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FINANCIAL LAB                                                                                          │
│ Objective: Inspect WattWise startup unit economics, burn, runway, and customer electricity savings    │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ WATTWISE STARTUP ECONOMICS (CORE COMPANY FINANCIALS)                                                  │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌────────────────────────────────────────┐ │
│ │ TOTAL MRR                 │ │ GROSS MARGIN              │ │ NET CASH RUNWAY                        │ │
│ │ Rp14,700,000              │ │ 78.4%                     │ │ 15.6 Months                            │ │
│ │ ● Baseline Calculated     │ │ ▲ Model Output            │ │ ▲ Simulation Trajectory                │ │
│ │ [Why this result?]        │ │ [Why this result?]        │ │ [Why this result?]                     │ │
│ └───────────────────────────┘ └───────────────────────────┘ └────────────────────────────────────────┘ │
│                                                                                                        │
│ STARTUP CASH & BURN BREAKDOWN:                                                                         │
│ • Starting Cash:       Rp60,000,000 (● Baseline Balance)                                               │
│ • Gross Revenue (MRR): Rp14,700,000                                                                    │
│ • Hosting & Cloud COGS:(Rp1,200,000) (▲ Infrastructure assumption)                                     │
│ • Operating Expenses:  (Rp17,350,000) (Salaries, Marketing, Operations)                                │
│ ────────────────────────────────────────────────────────────────────────────────                      │
│ • Net Monthly Burn:    (Rp3,850,000) / month                                                           │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [STRICT ISOLATION] CUSTOMER ECONOMIC IMPACT (NOT WATTWISE STARTUP REVENUE)                             │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ NOTICE: The figures below represent business savings achieved by WattWise customers at their       │ │
│ │ own commercial facilities. They do NOT represent SaaS subscription revenue for WattWise.           │ │
│ │                                                                                                    │ │
│ │ • Total Customer Facilities Monitored:   380 Locations (▲ Model Assumption)                        │ │
│ │ • Total Customer Electricity Spend:      Rp190,000,000 / month                                     │ │
│ │ • Estimated Customer Energy Savings:     Rp22,800,000 / month (12.0% efficiency gain)             │ │
│ │ • Customer Revenue After Electricity:    Rp807,200,000 / month [Why?] (ADR-008 Preserved)          │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Operations & Support Lab Wireframe (`OperationsLabView`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ OPERATIONS & SUPPORT LAB                                                                               │
│ Objective: Model operational burden, ticket volume, customer location density, and support capacity    │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ OPERATIONAL BURDEN & CAPACITY METRICS                                                                  │
│ ┌───────────────────────────┐ ┌───────────────────────────┐ ┌────────────────────────────────────────┐ │
│ │ MONTHLY SUPPORT TICKETS   │ │ AVG LOCATIONS / ACCOUNT   │ │ SUPPORT CAPACITY UTILIZATION           │ │
│ │ 42 Tickets / month        │ │ 1.27 Locations            │ │ 42.0% of 100 Ticket Capacity           │ │
│ │ ▲ Model Assumption        │ │ ▲ Model Output            │ │ [||||||||||||||||░░░░░░░░░░░░] SAFE    │ │
│ └───────────────────────────┘ └───────────────────────────┘ └────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ CAPACITY & INFRASTRUCTURE TUNING                                                                       │
│ • Support Ticket Rate:     [ 0.14 ] tickets / customer / mo (▲ Illustrative Simulation Value)          │
│ • Direct Support Cost:     [ Rp50,000 ] / ticket resolution (▲ Operational Assumption)                │
│ • Location Ingestion Load: [ 380 ] Total active telemetry streams                                      │
│ • Database & Storage COGS: [ Rp800,000 ] / month baseline                                              │
│                                                                                                        │
│ [?] EMPIRICAL UNKNOWN STATUS:                                                                          │
│ Support ticket volume and enterprise location scaling load have not been benchmarked with production  │
│ customer cohorts. Current values are heuristic simulation parameters.                                 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Incident Lab Wireframe (`IncidentLabView`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ INCIDENT & STRESS LAB                                                                                  │
│ Objective: Stress-test startup viability against simulated market shocks, outages, and churn spikes   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PRECONFIGURED STRESS SCENARIOS                                                                         │
│ [Select Stress Scenario: Sudden Churn Shock (3x Churn Spike) ▼]             [Run Stress Simulation]    │
│ Description: Simulates sudden macro volatility causing customer churn to spike from 8% to 24% for 3 mo │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ STRESS TEST IMPACT ANALYSIS (CURRENT BASELINE vs. INCIDENT)                                            │
│                                                                                                        │
│  Metric                | Baseline Scenario      | Under Stress Scenario   | Net Delta                 │
│ ───────────────────────┼────────────────────────┼─────────────────────────┼────────────────────────── │
│  Total MRR (Month 6)   | Rp14,700,000           | Rp8,200,000             | -44.2%  (Rp6,500,000 loss)│
│  Paid Customers (M6)   | 300 Customers          | 167 Customers           | -133 Customers            │
│  Cash Runway           | 15.6 Months            | 7.2 Months              | -8.4 Months (CRITICAL)    │
│  Support Capacity      | 42% (Normal)           | 88% (Near Limit)        | +46% Ticket Pressure      │
│                                                                                                        │
│ ┌────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚑ VULNERABILITY ALERT: RUNWAY CRITICAL UNDER SHOCK SCENARIO                                        │ │
│ │ Under this simulated incident, cash runway collapses below the safe 9-month buffer. Immediate cash │ │
│ │ preservation or support triage would be triggered.                                                 │ │
│ └────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                        │
│ [DEFERRED_CAPABILITY]: Hardware IoT sensor failure cascades and multi-tenant telemetry gateway brownout│
│ models require Phase 5 sensor simulation rules and are not currently evaluated by the Phase 3 engine.  │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Scenario Comparison Wireframe (`ScenarioCompareView`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SCENARIO COMPARISON (SIDE-BY-SIDE EVALUATION)                                                          │
│ Comparing: Scenario A [Default Baseline]  vs.  Scenario B [Aggressive Growth Beta]        [Exit Compare]│
├───────────────────────────────────────────────────┬────────────────────────────────────────────────────┤
│ SCENARIO A: DEFAULT BASELINE                      │ SCENARIO B: AGGRESSIVE GROWTH BETA                 │
│ Epistemic Profile: [42 Current] [18 Assump] [7 ?] │ Epistemic Profile: [38 Current] [22 Assump] [7 ?]  │
├───────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
│ Total MRR:          Rp14,700,000                  │ Total MRR:          Rp24,500,000  (↑ +66.7%)       │
│ Active Customers:   300 Accounts                  │ Active Customers:   500 Accounts  (↑ +200)         │
│ Net Monthly Burn:   (Rp3,850,000)                 │ Net Monthly Burn:   (Rp6,900,000) (↑ +79.2% Burn)  │
│ Cash Runway:        15.6 Months                   │ Cash Runway:        8.7 Months    (↓ -6.9 Months)  │
│ Support Load:       42 Tickets/mo (Safe)          │ Support Load:       95 Tickets/mo (⚠ Near Limit)   │
├───────────────────────────────────────────────────┴────────────────────────────────────────────────────┤
│ KEY TRADE-OFF SUMMARY (OBJECTIVE PRESENTATION — NO VALUE JUDGMENT)                                     │
│ • Trade-off: Scenario B generates 66.7% higher MRR by Month 6, but accelerates burn, reducing cash   │
│   runway by 6.9 months and straining support staff capacity past 90%.                                  │
│ • Modified Assumptions in Scenario B:                                                                  │
│   - Monthly Marketing Spend: Rp5,000,000 → Rp12,000,000 (+140%)                                        │
│   - Pro Tier Price:          Rp49,000 → Rp59,000 (+20.4%)                                              │
│   - Conversion Rate:         2.5% → 3.5% (▲ Simulation Assumption)                                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. "Why This Result?" / Execution Trace Drawer Wireframe (`TraceDrawer`)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ EXECUTION TRACE & PROVENANCE INSPECTOR                               [✕ Close]   │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Metric: Total Monthly Recurring Revenue (`total_mrr`)                            │
│ Output Value: Rp14,700,000  |  Epistemic Status: ● CURRENT (Derived)             │
│ Evaluated at: Month 3 of 12 (Simulation Tick 3)                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ENGINE FORMULA EVALUATION:                                                       │
│                                                                                  │
│   total_mrr = (active_starter_customers × starter_plan_monthly_price)            │
│             + (active_pro_customers     × pro_plan_monthly_price)                │
│             + (active_business_customers× business_plan_monthly_price)           │
│                                                                                  │
│ RUNTIME VARIABLE BREAKDOWN:                                                      │
│                                                                                  │
│  Variable Name                | Value         | Epistemic Status                 │
│ ──────────────────────────────┼───────────────┼───────────────────────────────── │
│  active_starter_customers     | 100 accounts  | ▲ Simulation Assumption          │
│  starter_plan_monthly_price   | Rp29,000 / mo | ● Current Baseline (ADR-002)     │
│  active_pro_customers         | 200 accounts  | ▲ Simulation Assumption          │
│  pro_plan_monthly_price       | Rp49,000 / mo | ● Current Baseline (ADR-002)     │
│  active_business_customers    | 20 accounts   | ▲ Simulation Assumption          │
│  business_plan_monthly_price  | Rp99,000 / mo | ● Current Baseline (ADR-002)     │
├──────────────────────────────────────────────────────────────────────────────────┤
│ PROVENANCE & RULE REGISTRATION:                                                  │
│ • Calculated by Engine Rule: `FINANCE_001_CALCULATE_MRR`                         │
│ • Rule Hash: `sha256:7f4a8e...`                                                 │
│ • Execution Time: 0.14 ms                                                        │
│ • Baseline Protection: Pricing locked by ADR-002. No scenario overrides active.  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Standardized UNKNOWN State Card Wireframe (`UnknownStateCard`)

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  COMMERCIAL FORECAST ERROR RATE (`forecast_error_rate`)                          │
├──────────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │  [ ? ] STATUS: EMPIRICAL UNKNOWN                                           │  │
│  │                                                                            │  │
│  │  Empirical benchmark data not available.                                    │  │
│  │  No field metering dataset currently validates forecasting accuracy for   │  │
│  │  Indonesian commercial refrigeration loads in production.                  │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│  CAUSAL IMPACT:                                                                  │
│  • Dependent metric `recommendation_confidence_pct` is flagged as UNKNOWN.      │
│  • Engine Rule `ENERGY_004` bypassed estimation to prevent fabricated outputs.   │
│                                                                                  │
│  [View Engine Trace]                                      [Set Simulation Heuristic] │
└──────────────────────────────────────────────────────────────────────────────────┘
```
