---
id: SIM-TEST-003
type: specification
status: CURRENT
owner: Architecture & Simulator Team
phase: Phase 3
confidence: HIGH
last_verified: 2026-09-27
sources:
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

# WattWise Operating Simulator — Phase 3 Test Matrix

This document defines the formal automated test matrix required to validate the Phase 3 Core Simulation Engine.

---

## 1. Test Suite Framework & Policy

- **Framework:** Node.js built-in `node:test` and `node:assert`.
- **Zero External Dependencies:** No external test libraries (`jest`, `vitest`, `mocha`, `chai`) required.
- **Execution Command:** `node --test tests/**/*.test.js`
- **Pass Criterion:** 100% test pass rate across all defined test families.

---

## 2. Test Families Inventory

| Family ID | Test Family Name | Coverage Objective | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **FAM-A** | **Baseline Loading** | Verifies canonical ADR baselines load correctly; confirms 10 empirical unknowns default to `UNKNOWN`. | PASS |
| **FAM-B** | **Scenario Overrides & Immutability** | Verifies scenario parameter overriding; confirms canonical baseline object remains immutable after runs. | PASS |
| **FAM-C** | **UNKNOWN Propagation** | Verifies missing mandatory inputs propagate as first-class `UNKNOWN`; asserts zero silent conversion to `0` or false defaults. | PASS |
| **FAM-D** | **Determinism** | Runs identical scenario twice; verifies identical output envelopes. | PASS |
| **FAM-E** | **Revenue Calculations** | Validates `pro_mrr`, `business_mrr`, `total_mrr`, `arr`, and `arpa` calculations against accounting identities. | PASS |
| **FAM-F** | **Customer Funnel Expected Values** | Validates deterministic expected-value funnel throughput without stochastic rounding noise. | PASS |
| **FAM-G** | **Validation Layer** | Tests rejection of invalid enums, negative counts, rates $> 1.0$, and unregistered variable keys. | PASS |
| **FAM-H** | **Dependency Resolution & Cycles** | Tests DAG topological sorting and detection of circular dependencies (`CycleError`). | PASS |
| **FAM-I** | **Financial Separation** | Proves customer-level `revenue_after_electricity` (ADR-008) cannot contaminate WattWise startup MRR or cash reserves. | PASS |
| **FAM-J** | **Provenance & Knowledge Status** | Tests proper inheritance of knowledge statuses (`CURRENT`, `ACCEPTED_BASELINE`, `SIMULATION_ASSUMPTION`, `UNKNOWN`). | PASS |

---

## 3. Golden Baseline Test Specification

The **Golden Baseline Test** asserts the immutable values established under human-approved ADR-002 through ADR-008:
- `business_tier_location_cap === 50`
- `pro_tier_location_cap === 3`
- `trial_activation_trigger === 'EXPLICIT'`
- `free_history_retention_mode === 'ROLLING_3_MONTH_WINDOW'`
- `forecast_method === 'DETERMINISTIC_HEURISTIC'`
- `data_provenance_mode === 'STRICT_TAGGED'`
- `revenue_after_electricity` defined as canonical customer metric.

---

## 4. Benchmark Scenario Specifications

### Scenario A: Canonical Baseline
- Default parameters with zero overrides.
- Validates that without empirical assumptions, operational outputs propagate as `UNKNOWN` safely.

### Scenario B: Conservative / High-Friction Scenario
- Overrides:
  - `onboarding_completion_rate`: `0.30`
  - `trial_start_rate`: `0.10`
  - `trial_to_paid_conversion_rate`: `0.01`
  - `monthly_account_churn_rate`: `0.08`
  - `support_tickets_per_customer`: `0.80`
  - `visitor_count`: `200`
- Validates constrained growth and elevated support burden.

### Scenario C: Growth-Oriented Scenario
- Overrides:
  - `onboarding_completion_rate`: `0.60`
  - `trial_start_rate`: `0.30`
  - `trial_to_paid_conversion_rate`: `0.05`
  - `monthly_account_churn_rate`: `0.03`
  - `support_tickets_per_customer`: `0.10`
  - `visitor_count`: `2000`
- Validates positive unit economics scaling and solvency duration expansion.
