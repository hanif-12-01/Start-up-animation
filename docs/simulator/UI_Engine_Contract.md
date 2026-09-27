---
id: SIM-CTR-001
type: specification
status: CURRENT
owner: Architecture & Simulator Team
phase: Phase 4A
confidence: HIGH
last_verified: 2026-09-27
sources:
  - SRC-001
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

# WattWise Operating Simulator — UI ↔ Engine Integration Contract
## Phase 4A UI Architecture & Design System

This document specifies the authoritative, binding integration contract between the frontend presentation layer and the Phase 3 [[Engine_Architecture|Core Simulation Engine]]. It establishes strict architectural boundaries, input/output data schemas, adapter responsibilities, and error-handling hierarchies to guarantee that the UI never becomes a secondary, uncalibrated simulation engine.

---

## 1. Fundamental Architectural Boundary

### 1.1 Inviolable Rule: The UI Never Calculates Business Logic
> [!CAUTION]
> **THE USER INTERFACE MUST NEVER BECOME A SECOND SIMULATION ENGINE.**
> Under no circumstances may any presentation component, React/Vue hook, utility helper, or state reducer execute business mathematics.

Specifically, the following calculations are **strictly forbidden** in UI code:
- **Forbidden:** $\text{total\_mrr} = \text{pro\_customers} \times \text{pro\_price} + \text{biz\_customers} \times \text{biz\_price}$
- **Forbidden:** $\text{cash\_runway\_months} = \text{cash\_balance} / \text{monthly\_burn}$
- **Forbidden:** $\text{new\_paid\_customers} = \text{trials} \times \text{conversion\_rate}$
- **Forbidden:** $\text{gross\_profit} = \text{total\_mrr} - \text{cogs}$
- **Forbidden:** $\text{support\_burden} = \text{tickets} / \text{capacity}$

### 1.2 Responsibilities Matrix

| System Domain | Presentation Layer (UI) | Adapter Layer (`SimulationAdapter`) | Core Simulation Engine (`src/engine/`) |
| :--- | :---: | :---: | :---: |
| Form Input Gathering | **YES** | No | No |
| Presentation Validation | **YES** | No | No |
| Scenario Packaging | No | **YES** | No |
| Domain Type Checking | No | **YES** | **YES** (`ScenarioValidator`) |
| Topological Rule Order | No | No | **YES** (`DependencyResolver`) |
| Mathematical Evaluation | **FORBIDDEN** | **FORBIDDEN** | **YES** (`SimulationEngine`, `RULES`) |
| UNKNOWN Propagation | No | No | **YES** (`SimulationValue`, `is_unknown`) |
| Inter-Tick Solvency Carryover | No | No | **YES** (`_applyInterTickTransitions`) |
| Execution Trace Logging | No | No | **YES** (`ExecutionTrace`) |
| View-Model Formatting | No | **YES** | No |
| Visual Rendering | **YES** | No | No |

---

## 2. Engine Public API Review

The Phase 3 engine exports the following stable surface via `src/index.js`:

```javascript
import {
  createSimulator,              // Factory creating wired SimulationEngine
  SimulationEngine,             // Core simulation engine class
  Scenario,                     // Immutable scenario definition class
  ScenarioManager,              // Multi-scenario catalog registry
  SimulationValue,              // Epistemic value envelope
  KnowledgeStatus,              // 6-level status enum
  ConfidenceRating,             // 4-level confidence enum
  createUnknownValue,           // Safe UNKNOWN value constructor
  VARIABLES,                    // Frozen catalog of 67 registered variables
  CANONICAL_BASELINE,           // Frozen default state (Map/Object)
  CANONICAL_EMPIRICAL_UNKNOWNS, // Frozen array of 10 empirical unknowns
  ADR_LOCKED_VARIABLES,         // Frozen array of 7 ADR-locked variables
  RULES,                        // Frozen array of 18 deterministic rules
  SimulatorError,               // Base error class
  ValidationError,              // Input type, range, or enum violation
  UnknownVariableError,         // Unregistered variable key error
  CycleError,                   // Dependency graph circularity error
  ModelExecutionError           // Runtime rule calculation failure
} from './src/index.js';
```

---

## 3. The Simulation Adapter Layer (`SimulationAdapter`)

The UI interacts with the engine exclusively through a thin, stateless adapter class:

```
┌─────────────────┐       Raw Form Values       ┌───────────────────┐
│                 │ ──────────────────────────► │                   │
│   UI Layer      │                             │ SimulationAdapter │
│ (Components)    │ ◄────────────────────────── │  (Thin Facade)    │
└─────────────────┘       Reactive View-Model   └─────────┬─────────┘
                                                          │
                                         Scenario Payload │ Engine Result
                                                          ▼
                                                ┌───────────────────┐
                                                │ SimulationEngine  │
                                                │  (Phase 3 Core)   │
                                                └───────────────────┘
```

### 3.1 Adapter Interface Specification

```typescript
interface SimulationAdapter {
  /**
   * Transforms raw UI form key-value pairs into a validated Scenario instance.
   */
  createScenario(config: {
    id: string;
    name: string;
    description?: string;
    overrides: Record<string, any>;
    baselineScenarioId?: string;
  }): Scenario;

  /**
   * Executes the simulation engine for a given scenario and horizon.
   */
  runSimulation(
    scenario: Scenario | null,
    options?: { horizonMonths?: number }
  ): SimulationRunViewModel;

  /**
   * Executes dual scenarios and generates an aligned delta comparison view model.
   */
  runComparison(
    scenarioA: Scenario | null,
    scenarioB: Scenario,
    options?: { horizonMonths?: number }
  ): ComparisonViewModel;

  /**
   * Formats a raw SimulationValue into an accessible presentation object.
   */
  formatSimulationValue(simVal: SimulationValue): ValueViewModel;

  /**
   * Retrieves step-by-step mathematical reasoning for a specific variable at tick t.
   */
  getTraceExplanation(
    trace: ExecutionTrace,
    variableId: string,
    tick: number
  ): TraceViewModel | null;

  /**
   * Aggregates active assumptions, empirical unknowns, and ADR baselines for a run.
   */
  getAssumptionAudit(runResult: any): AssumptionAuditViewModel;
}
```

---

## 4. Data Contracts & Schemas

### 4.1 Scenario Input Contract
When user modifies controls in any Lab, the UI dispatches an override map. The adapter guarantees strict typing:

```json
{
  "id": "custom_expansion_scen",
  "name": "Custom Scale Scenario",
  "description": "User adjusted marketing spend and location cap",
  "overrides": {
    "marketing_spend": 5000000.0,
    "pro_tier_location_cap": 3,
    "monthly_account_churn_rate": 0.05
  }
}
```

### 4.2 Value Presentation Contract (`ValueViewModel`)
The engine's `SimulationValue` envelope is projected into a presentation view model:

```json
{
  "variable_id": "total_mrr",
  "raw_value": 4900000,
  "formatted_value": "Rp4.900.000",
  "unit": "IDR/month",
  "is_unknown": false,
  "knowledge_status": "SIMULATION_ASSUMPTION",
  "knowledge_label": "Simulation Assumption",
  "confidence": "MEDIUM",
  "provenance": "RULE:RULE-REV-03",
  "explanation": "pro_mrr (4,900,000) + business_mrr (0) = 4,900,000 Total MRR",
  "is_adr_locked": false,
  "is_empirical_unknown": false,
  "badge_variant": "warning"
}
```

### 4.3 UNKNOWN Presentation Contract
When `is_unknown === true`, the presentation contract mandates explicit epistemic disclosure:

```json
{
  "variable_id": "monthly_account_churn_rate",
  "raw_value": "UNKNOWN",
  "formatted_value": "UNKNOWN",
  "unit": "ratio/month",
  "is_unknown": true,
  "knowledge_status": "UNKNOWN",
  "knowledge_label": "Canonical Empirical Unknown",
  "confidence": "UNKNOWN",
  "provenance": "CANONICAL_BASELINE",
  "explanation": "Zero empirical customer lifecycle data in snapshot (SRC-022 missing). Requires 6+ months live recurring billing telemetry.",
  "badge_variant": "danger",
  "why_unknown": {
    "reason_code": "MISSING_EMPIRICAL_TELEMETRY",
    "missing_evidence": "Longitudinal paid subscriber payment history (SRC-022)",
    "resolution_path": "Gather 6+ months of live billing data or set scenario assumption"
  }
}
```

### 4.4 Trace & Explanation Contract (`TraceViewModel`)
Clicking `"Why this result?"` requests a trace projection from the adapter:

```json
{
  "variable_id": "new_paid_customer_count",
  "tick": 1,
  "rule_id": "RULE-FUN-04",
  "rule_name": "New Paid Subscriber Cohort",
  "formula_expression": "trial_conversions (trials * trial_conv_rate) + sales_conversions (leads * sales_conv_rate)",
  "inputs": [
    {
      "id": "trial_user_count",
      "name": "Trial Accounts",
      "value": 15.0,
      "status": "SIMULATION_ASSUMPTION"
    },
    {
      "id": "trial_to_paid_conversion_rate",
      "name": "Trial Conversion Rate",
      "value": 0.05,
      "status": "SIMULATION_ASSUMPTION"
    },
    {
      "id": "leads",
      "name": "Sales Leads",
      "value": 20,
      "status": "SIMULATION_ASSUMPTION"
    },
    {
      "id": "sales_conversion_rate",
      "name": "Sales Conversion Rate",
      "value": 0.15,
      "status": "SIMULATION_ASSUMPTION"
    }
  ],
  "result_value": 3.75,
  "result_status": "SIMULATION_ASSUMPTION",
  "plain_english_summary": "(15.00 trials * 5.0% = 0.75) + (20 leads * 15.0% = 3.00) = 3.75 new paid customers"
}
```

---

## 5. UI Error Handling & Validation Contract

The adapter intercepts engine errors and maps them to localized UI form feedback:

| Engine Error Class | Trigger Condition | UI Presentation & Recovery Behavior |
| :--- | :--- | :--- |
| `ValidationError` (Type) | User inputs non-numeric value in float field | Highlights input in red; displays *"Must be a valid decimal number"*; prevents execution. |
| `ValidationError` (Min/Max) | User inputs value below minimum or above maximum | Displays boundary alert: *"Value must be between [min] and [max]"*; offers `[Set to Minimum]` button. |
| `ValidationError` (Enum) | Unrecognized dropdown option submitted | Reverts dropdown to previous valid selection; logs warning. |
| `UnknownVariableError` | Form submits obsolete or unregistered key | Suppresses key; displays warning banner in Model Engineer mode. |
| `CycleError` | Circular causal loop introduced | Displays modal alert illustrating cyclic dependency path; prompts scenario reset. |
| `ModelExecutionError` | Numerical division by zero or formula crash | Displays amber alert on affected metric card; tags output as `UNKNOWN (Evaluation Error)`. |

---

## 6. Documented UI Integration Gaps

The Phase 4A audit identifies two non-blocking integration gaps between UI feature desires and current engine capabilities:

### `UI-GAP-01`: Multi-Scenario Parallel Execution
- **Observation:** `SimulationEngine.run()` executes exactly one scenario per invocation.
- **UI Desired Capability:** Real-time side-by-side scenario comparison across the 12-month horizon.
- **Resolution Strategy:** Handled entirely within the adapter layer. The adapter orchestrates two sequential `simulator.run()` calls (Run A and Run B), aligns their tick arrays, and computes delta view-models. No engine core modification required.

### `UI-GAP-02`: Month-Specific Parameter Schedules
- **Observation:** Current engine applies scenario overrides uniformly across the entire horizon ($t = 0 \dots H$).
- **UI Desired Capability:** Allowing users to model phased investments (e.g. marketing spend of Rp0 for M0–M3, jumping to Rp5.000.000 in M4).
- **Classification:** `DEFERRED_CAPABILITY`. Deferred to Phase 4B/5. Phase 4A UI will expose static horizon-wide scenario levers.

---

## Related Documents

- [[Engine_Architecture]]
- [[Simulation_Rulebook]]
- [[Variable_Dictionary]]
- [[Dependency-Map]]
- [[Phase_3_Test_Matrix]]
- [[UI_Information_Architecture]]
- [[UI_Design_System]]
- [[UI_Component_Architecture]]
- [[UI_Wireframes]]
- [[Phase_4B_Implementation_Plan]]
