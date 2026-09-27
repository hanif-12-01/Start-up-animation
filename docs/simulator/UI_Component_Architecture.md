# UI Component Architecture
**WattWise Operating Simulator — Phase 4A UI Architecture**
*Status: Phase 4A Specification / Canonical Architecture*
*Relates to: [[UI_Information_Architecture]], [[UI_Engine_Contract]], [[UI_Design_System]], [[Engine_Architecture]], [[Variable_Dictionary]]*

---

## 1. Architectural Philosophy & Engine Boundary

The WattWise Operating Simulator UI is designed as a **pure presentation and interaction layer**. In accordance with the inviolable non-calculation rule defined in [[UI_Engine_Contract]], the UI layer possesses **zero financial or business logic calculation capabilities**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BROWSER PRESENTATION LAYER                      │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                        AppShell State                          │   │
│   │   (activeLab, selectedScenario, pendingOverrides, activeTick)  │   │
│   └──────────────────────┬──────────────────▲──────────────────────┘   │
│                          │                  │                          │
│                          ▼                  │                          │
│   ┌─────────────────────────────┐    ┌──────┴──────────────────────┐   │
│   │     Component Hierarchy     │    │      SimulationAdapter      │   │
│   │  (Views, Controls, Cards)   │    │     (Pure Data Mapper)      │   │
│   └─────────────────────────────┘    └──────▲──────────────────────┘   │
└─────────────────────────────────────────────┼──────────────────────────┘
                                              │ (Structured Data Only)
┌─────────────────────────────────────────────▼──────────────────────────┐
│                      PHASE 3 CORE SIMULATION ENGINE                     │
│                 (SimulationEngine, Model, Rule Registry)               │
│                                                                        │
│  • Mathematical Execution     • Epistemic Classification               │
│  • Rule Evaluations           • Execution Tracing & Provenance         │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Boundaries
1. **Unidirectional Data Flow**: User interactions mutate presentation state (e.g., input values in scenario controls). The presentation state is submitted to `SimulationAdapter.runSimulation()`. The engine executes all formulas and returns an immutable `SimulationRunResult`. The adapter transforms this into UI View Models. Components render strictly from View Models.
2. **Framework Agnosticism**: Component definitions are structured as semantic view descriptors with clean lifecycle contracts (`mount`, `render`, `update`, `destroy`). This allows implementation in native Vanilla JavaScript (ESM + Template Literals / DOM Nodes) without framework lock-in.
3. **No Phantom Calculations**: If a metric is derived (e.g., Gross Margin = Gross Profit / Revenue), the UI **never** divides two numbers. It reads `result.getMetric('gross_margin')` computed by the engine. If the engine output is `UNKNOWN`, the component renders an `UnknownStateCard`.

---

## 2. Global Presentation State Ownership

The simulator maintains a centralized, lightweight reactive presentation store (`SimulatorStore`). It holds only navigation and interaction state; it does **not** store duplicate engine equations.

```
SimulatorStore State Schema:
{
  // Navigation & Viewport
  activeLab: 'overview' | 'product' | 'growth' | 'finance' | 'operations' | 'incident',
  viewMode: 'standard' | 'expert',
  
  // Scenario Configuration
  scenarioId: 'baseline_default',
  baselineScenario: ScenarioObject, // Engine scenario instance
  pendingOverrides: Map<variable_id, any>, // User-edited values before run
  activeOverrides: Map<variable_id, any>,  // Values submitted in last run
  
  // Simulation Execution State
  engineStatus: 'IDLE' | 'DIRTY' | 'VALIDATING' | 'RUNNING' | 'SUCCESS' | 'ERROR',
  validationErrors: Array<UIValidationError>,
  engineError: UIErrorModel | null,
  
  // Active Run Data
  runResult: SimulationRunResult | null, // Engine run output
  activeTick: number,                    // Currently scrubbed timeline tick (e.g., 0 to 12)
  
  // Comparison State
  compareModeActive: boolean,
  comparisonScenarioId: string | null,
  comparisonResult: SimulationRunResult | null,
  
  // Inspection & Provenance Drawer
  traceDrawer: {
    isOpen: boolean,
    targetVariableId: string | null,
    tick: number
  }
}
```

---

## 3. High-Level Component Hierarchy

```
AppShell
 ├── TopBar
 │    ├── BrandIdentity (Logo, Title, Version Tag)
 │    ├── ScenarioSelector (Dropdown, Scenario Metadata Badges)
 │    ├── EngineStateIndicator (Status pill: Idle, Dirty, Running, Error)
 │    ├── ActionGroup (Reset Overrides Button, Run Simulation Button)
 │    └── ViewToggle (Standard vs. Expert Mode)
 │
 ├── MainLayout (Split Navigation + Workspace)
 │    ├── SidebarNavigation
 │    │    ├── LabNavList (Overview, Product, Growth, Finance, Operations, Incident)
 │    │    ├── CompareToggle
 │    │    └── EpistemicLegend (Mini summary of status badges)
 │    │
 │    └── LabContainer (Active Lab Viewport)
 │         ├── LabHeader (Title, Description, Epistemic Health Summary)
 │         │
 │         ├── LabBody (Active Lab Specific Content)
 │         │    ├── OverviewLabView
 │         │    ├── ProductLabView
 │         │    ├── GrowthLabView
 │         │    ├── FinanceLabView
 │         │    ├── OperationsLabView
 │         │    └── IncidentLabView
 │         │
 │         └── ComparisonView (Rendered when compareModeActive = true)
 │
 ├── TimelineTray (Persistent Bottom Dock)
 │    ├── TimelineScrubber (Month 0 to Month N slider + step buttons)
 │    ├── PlaybackControls (Play/Pause, Step Next/Prev, Speed Select)
 │    ├── TickBadge (Current Month indicator + Epistemic Status count)
 │    └── AnomalyMarkers (Tick flags indicating UNKNOWN spikes or churn triggers)
 │
 └── ModalsAndDrawers (Overlay Layer)
      ├── TraceDrawer ("Why This Result?" / Execution Trace inspector)
      ├── VariableSearchModal (Quick variable finder with domain filters)
      └── EngineErrorModal (Engine exception or cyclical dependency details)
```

---

## 4. Shared Core Components

### 4.1 `MetricCard`
- **Purpose**: Displays a single engine output metric with its epistemic status, formatted value, delta from baseline, and an inspection trigger.
- **Props / Contract**:
  - `metricId`: string (Variable ID from [[Variable_Dictionary]], e.g., `'total_mrr'`)
  - `viewModel`: `UIMetricViewModel` (from [[UI_Engine_Contract]])
  - `onInspect`: `(metricId) => void` (Opens `TraceDrawer`)
- **Internal States**:
  - `Normal`: Displays formatted value + `KnowledgeBadge`
  - `Unknown`: Replaces value with `UnknownStateIndicator` + "Why?" button
  - `Dirty`: Subtle visual pulse when scenario overrides have been modified but simulation has not been rerun.

### 4.2 `KnowledgeBadge`
- **Purpose**: Communicates epistemic classification without relying purely on color (icon + label + tooltip).
- **Props**:
  - `status`: `'CURRENT' | 'ACCEPTED_BASELINE' | 'SIMULATION_ASSUMPTION' | 'HYPOTHESIS' | 'UNKNOWN' | 'TARGET' | 'IMPLEMENTATION_GAP'`
  - `source`: string (Source citation, e.g., `'ADR-002'`, `'Phase 2 Dictionary'`)
  - `confidence`: `'HIGH' | 'MEDIUM' | 'LOW' | 'NONE'`
- **Rendering**: Emits tokenized badge classes (`badge--current`, `badge--assumption`, `badge--unknown`) as specified in [[UI_Design_System]].

### 4.3 `UnknownStateCard`
- **Purpose**: Standardized first-class presentation for variables where empirical data is missing or derived dependencies are unknown.
- **Contract**:
  - `variableId`: string
  - `label`: string
  - `unknownReason`: string (Engine trace provenance explanation)
  - `isEmpirical`: boolean (True if missing raw market benchmark; False if caused by upstream unknown)
  - `upstreamCauses`: Array<string> (List of variables causing this output to be unknown)
- **Visual Spec**: Neutral hatched border, warning icon, explicit label `"UNKNOWN: Empirical benchmark not available"`, and link to inspect upstream causes.

### 4.4 `VariableControl` (Form Input Wrapper)
- **Purpose**: Renders the appropriate form input based on the variable's physical and epistemic data type.
- **Props**:
  - `variableDef`: `VariableDefinition` from Phase 2 dictionary
  - `currentValue`: any
  - `baselineValue`: any
  - `isOverridden`: boolean
  - `validationError`: string | null
  - `onChange`: `(variableId, newValue) => void`
  - `onReset`: `(variableId) => void`
- **Sub-Types**:
  - `BooleanToggle`: For boolean flags (`trial_requires_card`, `recommendation_engine_gated`)
  - `SegmentedControl`: For enums (`forecast_method`, `data_provenance_retention_policy`)
  - `NumericStepper / Slider`: For bounded rates (`trial_to_paid_conversion_rate`, `monthly_churn_rate`)
  - `CurrencyInput`: For monetary values with IDR masking (`pro_plan_monthly_price`)
  - `IntegerInput`: For integer counts (`pro_plan_max_locations`, `visitor_count`)

### 4.5 `TraceDrawer` ("Why This Result?" Inspector)
- **Purpose**: Displays the complete computational provenance and formula breakdown for any selected metric without UI formula duplication.
- **Data Input**: `UITraceViewModel` generated directly from engine execution traces:
  - Metric name & formatted value.
  - Formula expression string (engine-generated, e.g., `active_pro_customers * pro_plan_monthly_price`).
  - Inputs table with variable name, runtime value, and epistemic badge.
  - Provenance breadcrumb (ADR lock, scenario override, or default baseline).
  - "Close" and "Open Upstream Variable" actions.

---

## 5. Lab-Specific Component Architectures

### 5.1 Overview / Command Center (`OverviewLabView`)
- **Components**:
  - `HeroMetricGrid`: 4 primary metrics (`total_mrr`, `active_paid_customers`, `net_monthly_burn`, `cash_runway_months`).
  - `EpistemicHealthSummary`: Breakdown bar showing distribution of Current vs. Assumptions vs. Unknowns in the current run.
  - `TrajectorySparkGrid`: Mini sparkline cards showing 12-month projections of MRR, Cash, and Customers.
  - `ScenarioContextBanner`: Identifies active scenario, baseline divergence count, and last execution duration.
  - `QuickTuningDrawer`: Collapsible tray exposing top 5 high-sensitivity scenario controls.

### 5.2 Product Lab (`ProductLabView`)
- **Focus**: Product policy trade-offs, packaging limits, and feature gating.
- **Components**:
  - `PlanPackagingMatrix`: Side-by-side comparison cards for Starter, Pro, and Business tiers.
    - Pro Location Cap Control (`pro_plan_max_locations`).
    - Business Location Cap Control (`business_plan_max_locations`).
    - Feature Gating Toggles (`recommendation_engine_gated`, `trial_requires_card`).
  - `PolicyImpactCard`: Displays derived impact on ARPA and Gross Margin.
  - `ADRLockCallout`: Clear callout highlighting that baseline values are locked by [[06_DECISION_LOG|ADR-002, ADR-003, ADR-004]]. Any change is flagged as a `SIMULATION_ASSUMPTION`.

### 5.3 Growth / GTM Lab (`GrowthLabView`)
- **Focus**: Acquisition funnel, conversion milestones, and retention dynamics.
- **Components**:
  - `FunnelVisualization`: Native SVG step-down funnel showing:
    - `visitor_count` $\to$ `signup_rate` $\to$ `onboarding_completion_rate` $\to$ `trial_to_paid_conversion_rate`.
    - Each conversion stage labeled with its epistemic status (e.g., Trial Conversion = Assumption).
  - `AcquisitionInputGroup`: Controls for marketing spend, lead volume, and visitor rates.
  - `RetentionDynamicsCard`: Controls for `monthly_churn_rate` and `expansion_rate`.
  - `EmpiricalWarningNotice`: Sticky warning banner stating commercial conversion benchmarks are empirical unknowns in Phase 2/3.

### 5.4 Financial Lab (`FinancialLabView`)
- **Focus**: Startup unit economics, runway, burn, and strict customer decoupling.
- **Components**:
  - `StartupEconomicsGrid`: Cards for `total_mrr`, `total_arr`, `gross_margin_pct`, `net_monthly_burn`, `cash_runway_months`.
  - `CostBreakdownWaterfall`: Stacked visual bar showing COGS (Hosting, Third-party APIs, Support burden) vs. Net Profit.
  - `CustomerImpactDecoupledPanel`: **Strict boundary isolation**. Separate panel titled:
    *"Customer Economic Impact (Non-Startup Revenue)"*. Renders `revenue_after_electricity` and customer bill savings, styled with unique blue/slate accent tokens to prevent visual confusion with WattWise revenue.
  - `CashRunwayGauge`: Visual trajectory meter warning if runway is under 6 months.

### 5.5 Operations / Support Lab (`OperationsLabView`)
- **Focus**: Operational burden, support capacity constraints, and infrastructure scaling.
- **Components**:
  - `SupportBurdenCard`: Ratio of support tickets to active customer locations (`support_tickets_per_customer`).
  - `OperationalCapacityMeter`: Comparison of calculated ticket volume against assumed support staff capacity.
  - `InfrastructureCostGroup`: Cost curves for database, multi-location ingestion, and notification infrastructure.
  - `BurdenAlertBanner`: Flags operational bottleneck if ticket volume exceeds baseline threshold.

### 5.6 Incident Lab (`IncidentLabView`)
- **Focus**: Stress-testing edge cases, stress scenarios, and vulnerability inspection.
- **Interaction Contract**:
  - `PreconfiguredStressScenarios`: Dropdown or cards for engine-supported stress cases (e.g., "High Churn Spike", "Zero Ingestion Downtime", "Support Inundation").
  - `StressTestRunner`: Executes the selected stress scenario against current baseline.
  - `IncidentImpactTable`: Delta analysis showing drop in runway and MRR impact.
  - `DeferredIncidentNotice`: For complex multi-factor incidents not currently supported by Phase 3 rules, displays `DEFERRED_CAPABILITY` badge with governance cross-reference.

---

## 6. Comparison Mode Component Architecture (`ScenarioCompareView`)

When `compareModeActive = true`, the application shell splits the workspace into a side-by-side comparison layout:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SCENARIO COMPARISON VIEW                        │
├───────────────────────────────────┬────────────────────────────────────┤
│ Baseline / Scenario A             │ Scenario B (Alternative / Overrides│
├───────────────────────────────────┼────────────────────────────────────┤
│ Scenario: Default Baseline        │ Scenario: Aggressive Growth Beta   │
│ Assumptions: 2                    │ Assumptions: 7                     │
│ Unknowns: 3                       │ Unknowns: 3                        │
├───────────────────────────────────┼────────────────────────────────────┤
│ Total MRR: Rp14,700,000           │ Total MRR: Rp24,500,000 (+66.7%)   │
│ Runway: 14.2 Months               │ Runway: 9.8 Months (-4.4 Months)   │
│ Active Customers: 300             │ Active Customers: 500 (+200)       │
│ Support Burden: Normal            │ Support Burden: WARNING (Overload) │
├───────────────────────────────────┴────────────────────────────────────┤
│ Comparative Delta Table (Variables Modified & Direction of Trade-off)  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Delta Engine**: Compares `runResultA` and `runResultB` across shared metric IDs.
- **Trade-off Objectivity**: Does not display "Scenario B is Better" badges. Uses neutral directional arrows ($\uparrow$ / $\downarrow$) and highlights trade-offs (e.g., "Higher MRR (+66%) at cost of Lower Runway (-31%)").

---

## 7. Engine Boundary & Testability

1. **Isolation from DOM**: All adapters, view-model generators, and state machines are pure ESM functions with no direct browser DOM dependencies. They can be tested in Node.js unit tests with 100% code coverage.
2. **Mockable Contract**: The UI can be rendered against a mock engine run result, facilitating frontend visual testing without re-executing mathematical engine passes during design iteration.
3. **No Side-Effects**: Running a simulation is a pure read-and-execute cycle. No localStorage, network calls, or external analytics mutations occur.
