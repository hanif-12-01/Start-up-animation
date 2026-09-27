# Phase 4B Implementation Plan
**WattWise Operating Simulator — Vertical Slices & Execution Roadmap**
*Status: Phase 4A Architecture Output — PHASE 4B LOCKED / NOT STARTED*
*Relates to: [[UI_Information_Architecture]], [[UI_Engine_Contract]], [[UI_Design_System]], [[UI_Component_Architecture]], [[UI_Wireframes]], [[Engine_Architecture]], [[Phase_3_Test_Matrix]]*

> [!WARNING]
> This document defines the engineering plan for Phase 4B implementation. Execution of this plan is strictly **LOCKED** until formal authorization is granted by the Human Project Owner. No frontend application code or dependency installation may take place in Phase 4A.

---

## 1. Executive Summary & Technology Foundation

### 1.1 Architecture & Stack Choice
Based on the architectural evaluations in [[UI_Information_Architecture]] and [[UI_Component_Architecture]], the Phase 4B frontend implementation will utilize:
1. **Runtime Framework**: Native Vanilla HTML5, CSS3, and ECMAScript Modules (ESM).
   - *Rationale*: Eliminates compilation bloat, framework churn, and virtual DOM overhead. The Phase 3 simulation engine is already authored in standard ESM (`src/index.js`), enabling direct, seamless browser consumption.
2. **Styling Engine**: Tokenized Vanilla CSS via custom properties (`tokens.css`, `layout.css`, `components.css`).
   - *Rationale*: Full fidelity to [[UI_Design_System]], zero build-step requirement, native browser variables.
3. **Visualization & Charting**: Lightweight Native SVG component renderers (`SvgChart.js`).
   - *Rationale*: No heavy charting dependencies (e.g., Chart.js, Recharts, D3); exact control over epistemic styling (e.g., dashed lines for assumptions, hatched bars for unknowns).
4. **Build Tooling / Dev Server**: Standard lightweight Vite dev server (`npx -y vite@latest`) for rapid local HMR if desired, with zero production runtime dependencies.

### 1.2 The Inviolable Non-Calculation Rule
Every slice must adhere to the core rule: **The UI layer performs zero business or financial calculations**. All computations, roundings, epistemic statuses, and execution traces are supplied by the core engine via `SimulationAdapter`.

---

## 2. Vertical Slice Breakdown

The implementation is partitioned into 12 discrete, verifiable vertical slices. Each slice delivers end-to-end functionality within its domain, complete with automated regression tests.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PHASE 4B VERTICAL SLICES                        │
├───────────────────┬────────────────────────────────────────────────────┤
│ FOUNDATION        │ Slice 01: App Shell + SimulationAdapter Bridge     │
│                   │ Slice 02: Central State Store + Scenario Controls  │
├───────────────────┼────────────────────────────────────────────────────┤
│ LAB DELIVERIES    │ Slice 03: Command Center (Overview Lab)            │
│                   │ Slice 04: Product Lab + Plan Packaging Controls    │
│                   │ Slice 05: Growth / GTM Lab + Funnel Renderer       │
│                   │ Slice 06: Financial Lab + Decoupled Customer Panel │
│                   │ Slice 07: Operations Lab + Capacity Meters         │
│                   │ Slice 08: Incident Lab + Preconfigured Shocks      │
├───────────────────┼────────────────────────────────────────────────────┤
│ ADVANCED UX       │ Slice 09: Timeline Scrubber + Multi-Tick Playback  │
│                   │ Slice 10: "Why This Result?" Trace Drawer          │
│                   │ Slice 11: Side-by-Side Scenario Comparison Mode    │
├───────────────────┼────────────────────────────────────────────────────┤
│ QUALITY & POLISH  │ Slice 12: WCAG 2.1 AA Accessibility + E2E Tests    │
└───────────────────┴────────────────────────────────────────────────────┘
```

---

### Slice 01: App Shell + SimulationAdapter Bridge
- **Scope**:
  - Implement `src/ui/adapter/SimulationAdapter.js` conforming to [[UI_Engine_Contract]].
  - Implement `index.html` structure with semantic regions (`<header>`, `<nav>`, `<main>`, `<footer>`).
  - Implement CSS design tokens (`src/ui/styles/tokens.css`) from [[UI_Design_System]].
  - Connect `SimulationAdapter` to `SimulationEngine` via browser ESM import.
- **Deliverables**:
  - Working static shell rendering brand header, navigation menu, and active lab container.
  - Automated unit test verifying `SimulationAdapter.runSimulation()` correctly formats engine output into `UIViewModel`.
- **Validation Criteria**: Shell mounts cleanly in browser with zero console errors. Adapter passes all schema validation tests.

---

### Slice 02: Central State Store + Scenario Controls
- **Scope**:
  - Implement `src/ui/state/SimulatorStore.js` managing active lab, selected scenario, pending overrides, and dirty states.
  - Implement `ScenarioSelector` dropdown and `VariableControl` primitives (stepper, toggle, input).
  - Implement "Run Simulation" and "Reset Overrides" triggers.
- **Deliverables**:
  - TopBar controls allowing user to select Baseline vs. Illustrative scenarios.
  - Dirty state indicator showing when overrides require re-running the engine.
- **Validation Criteria**: Selecting a scenario updates store state; modifying an override marks state as `DIRTY`; clicking "Run" transitions to `RUNNING` $\to$ `SUCCESS`.

---

### Slice 03: Command Center (Overview Lab)
- **Scope**:
  - Implement `OverviewLabView` containing `HeroMetricGrid` (MRR, Paid Customers, Burn, Runway).
  - Implement `KnowledgeBadge` component supporting all 7 epistemic statuses.
  - Implement `EpistemicHealthSummary` breakdown bar.
  - Implement `QuickTuningDrawer` for high-sensitivity variables.
- **Deliverables**:
  - Full Command Center displaying live baseline metrics computed by Phase 3 engine.
- **Validation Criteria**: All displayed metrics match exact values from `SimulationEngine.run('baseline_default')`. Zero UI-computed numbers.

---

### Slice 04: Product Lab + Plan Packaging Controls
- **Scope**:
  - Implement `ProductLabView` rendering Starter, Pro, and Business tier packaging cards.
  - Implement location cap steppers (`pro_plan_max_locations`, `business_plan_max_locations`).
  - Implement feature gating toggles (`recommendation_engine_gated`).
  - Implement `ADRLockCallout` visually protecting ADR-002 / ADR-003 baselines.
- **Deliverables**:
  - Interactive Product Lab allowing users to model pricing and location cap alternatives.
- **Validation Criteria**: Modifying Pro location cap marks output as `SIMULATION_ASSUMPTION` and recalculates ARPA via the engine.

---

### Slice 05: Growth / GTM Lab + Funnel Renderer
- **Scope**:
  - Implement `GrowthLabView` with Native SVG stepped conversion funnel (`visitor_count` $\to$ `signup_rate` $\to$ `trial_start_rate` $\to$ `trial_to_paid_conversion_rate`).
  - Implement acquisition and retention input controls (marketing spend, monthly churn).
  - Implement `EmpiricalWarningNotice` for uncalibrated churn and trial benchmarks.
- **Deliverables**:
  - Dynamic visual funnel displaying stage-by-stage drop-off with explicit epistemic badges.
- **Validation Criteria**: Funnel stages with unknown benchmarks render neutral warning styles; known baseline steps render solid current styles.

---

### Slice 06: Financial Lab + Decoupled Customer Panel
- **Scope**:
  - Implement `FinancialLabView` showing Startup Economics (MRR, ARR, Margin, Burn, Runway).
  - Implement `CostBreakdownWaterfall` component.
  - Implement strictly decoupled `CustomerImpactDecoupledPanel` for customer electricity savings (`revenue_after_electricity`) under ADR-008.
- **Deliverables**:
  - Financial dashboard with clear, unmistakable visual isolation between WattWise revenue and Customer savings.
- **Validation Criteria**: Customer electricity savings cannot be conflated with startup revenue; styled with distinct slate/blue visual tokens.

---

### Slice 07: Operations Lab + Capacity Meters
- **Scope**:
  - Implement `OperationsLabView` with `SupportBurdenCard` and `OperationalCapacityMeter`.
  - Implement multi-location ingestion density controls.
  - Implement capacity overload threshold warnings.
- **Deliverables**:
  - Operations workspace displaying support ticket volume vs. staff capacity.
- **Validation Criteria**: Support load exceeding baseline capacity dynamically triggers operational warning banner.

---

### Slice 08: Incident Lab + Preconfigured Shocks
- **Scope**:
  - Implement `IncidentLabView` featuring preconfigured stress test selectors (e.g., "Churn Shock", "Support Overload").
  - Implement `IncidentImpactTable` displaying comparative deltas against baseline.
  - Implement `DEFERRED_CAPABILITY` notices for Phase 5 sensor failure scenarios.
- **Deliverables**:
  - Incident testing interface allowing users to evaluate startup fragility.
- **Validation Criteria**: Running stress test updates metrics and displays runway vulnerability alert without corrupting baseline scenario.

---

### Slice 09: Timeline Scrubber + Multi-Tick Playback
- **Scope**:
  - Implement `TimelineTray` docking at bottom of application shell.
  - Implement monthly tick scrubber (Month 0 to Month 12), step buttons, and play/pause timer.
  - Implement time-series caching inside `SimulatorStore`.
- **Deliverables**:
  - Interactive playback allowing users to step through simulation months and observe trajectory changes.
- **Validation Criteria**: Scrubbing to Month $N$ updates all Lab views with data from tick $N$ synchronously.

---

### Slice 10: "Why This Result?" Execution Trace Drawer
- **Scope**:
  - Implement `TraceDrawer` modal component conforming to [[UI_Component_Architecture]].
  - Connect inspection triggers on all `MetricCard` components to adapter trace formatter.
  - Display engine formula breakdown, runtime variable values, and rule hash.
- **Deliverables**:
  - Clickable "Why this result?" trigger on every key metric opening full provenance drawer.
- **Validation Criteria**: Trace display matches exact execution log generated by Phase 3 `RuleRegistry`.

---

### Slice 11: Side-by-Side Scenario Comparison Mode
- **Scope**:
  - Implement `ScenarioCompareView` enabling two scenarios to run and display side-by-side.
  - Implement comparative delta calculations (direction $\uparrow$/$\downarrow$, absolute delta, percentage delta).
  - Implement Trade-Off Summary highlighting non-judgmental pros and cons.
- **Deliverables**:
  - Full comparison view showing Baseline vs. Alternative with assumption deltas.
- **Validation Criteria**: Comparison view highlights assumption trade-offs without declaring either scenario "superior".

---

### Slice 12: WCAG 2.1 AA Accessibility + E2E Validation
- **Scope**:
  - Implement complete keyboard navigation (`Tab`, `Shift+Tab`, `Arrow` keys on scrubber).
  - Implement ARIA live regions for simulation run status updates.
  - Contrast audit using Chrome DevTools Lighthouse / axe-core (aiming for $\ge 4.5:1$ ratio).
  - Automated end-to-end integration test suite.
- **Deliverables**:
  - Fully accessible, validated simulator interface ready for competition presentation.
- **Validation Criteria**: Zero accessibility violations; 100% of integration test suite passes.

---

## 3. Risk Mitigation & Quality Gates

| Risk Category | Potential Failure | Mitigation in Phase 4B |
| :--- | :--- | :--- |
| **Logic Duplication** | Developer writes `mrr = customers * price` in UI code. | Automated lint rule / code review blocking math operators in `src/ui/`. All data must come from `adapter`. |
| **Epistemic Dilution** | Assumptions or unknowns displayed as verified facts. | `MetricCard` mandates `KnowledgeBadge` prop; renders warning if unclassified. |
| **State Desync** | Overrides modified without re-running engine. | Dirty state disables stale metric tooltips and visually dims outputs until "Run Simulation" is clicked. |
| **Scope Creep** | Adding features beyond Phase 3 engine capabilities. | Strict `DEFERRED_CAPABILITY` badge required for unsupported model concepts. |
