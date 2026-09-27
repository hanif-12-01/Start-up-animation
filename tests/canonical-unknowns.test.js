/**
 * Regression Test Suite: Canonical Unknowns, Runtime Unknowns, ADR Provenance, and Inter-Tick Safety
 * Phase 3 Governance Alignment Pass
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSimulator,
  Scenario,
  CANONICAL_BASELINE,
  CANONICAL_EMPIRICAL_UNKNOWNS,
  ADR_LOCKED_VARIABLES,
  VARIABLES
} from '../src/index.js';

describe('Family K: Canonical Unknown Semantics & Governance Alignment', () => {

  describe('1. Canonical Empirical Unknowns Register (Section 16)', () => {
    const EXPECTED_TEN_CANONICAL_UNKNOWNS = [
      'monthly_account_churn_rate',
      'trial_to_paid_conversion_rate',
      'cac',
      'support_tickets_per_customer',
      'support_cost_per_ticket',
      'support_tickets_per_location',
      'visitor_count',
      'forecast_error_rate',
      'database_cost',
      'average_locations_per_business_account'
    ];

    it('contains EXACTLY the 10 Phase 2 Human-Accepted canonical empirical unknowns', () => {
      assert.equal(
        CANONICAL_EMPIRICAL_UNKNOWNS.length,
        10,
        `Expected exactly 10 canonical empirical unknowns, got ${CANONICAL_EMPIRICAL_UNKNOWNS.length}`
      );

      const actualSorted = [...CANONICAL_EMPIRICAL_UNKNOWNS].sort();
      const expectedSorted = [...EXPECTED_TEN_CANONICAL_UNKNOWNS].sort();
      assert.deepEqual(actualSorted, expectedSorted, 'Canonical empirical unknown list does not match Phase 2 register');
    });

    it('fails if any canonical empirical unknown has an unsupported numeric baseline in CANONICAL_BASELINE', () => {
      for (const varId of EXPECTED_TEN_CANONICAL_UNKNOWNS) {
        assert.equal(
          CANONICAL_BASELINE[varId],
          'UNKNOWN',
          `Canonical empirical unknown '${varId}' must have baseline value 'UNKNOWN'`
        );
      }
    });

    it('prohibits arbitrary insertions or deletions into the canonical empirical register', () => {
      // Prohibited variables that were previously mislabeled in earlier drafts
      const nonEmpiricalUnknowns = [
        'signup_rate',
        'signup_count',
        'onboarding_completion_rate',
        'onboarded_user_count',
        'trial_start_rate',
        'trial_user_count',
        'leads',
        'qualified_leads',
        'total_mrr',
        'arr',
        'cash_runway_months'
      ];

      for (const varId of nonEmpiricalUnknowns) {
        assert.ok(
          !CANONICAL_EMPIRICAL_UNKNOWNS.includes(varId),
          `Variable '${varId}' must NOT be included in CANONICAL_EMPIRICAL_UNKNOWNS`
        );
      }
    });
  });

  describe('2. Derived Runtime UNKNOWN vs Canonical Empirical UNKNOWN (Section 17)', () => {
    it('proves that a derived variable becoming UNKNOWN at runtime is NOT in the canonical empirical register', () => {
      const simulator = createSimulator();
      const result = simulator.run(); // Baseline run
      const state0 = result.ticks[0];

      // Derived variables that become runtime unknowns due to upstream unknowns
      const runtimeUnknowns = [
        'signup_count',
        'onboarded_user_count',
        'trial_user_count',
        'new_paid_customer_count',
        'total_mrr',
        'arr',
        'monthly_burn',
        'cash_runway_months'
      ];

      for (const varId of runtimeUnknowns) {
        const simVal = state0.get(varId);
        assert.ok(simVal, `Variable ${varId} must exist in state`);
        assert.equal(simVal.is_unknown, true, `${varId} must be UNKNOWN at runtime under baseline`);
        assert.ok(
          !CANONICAL_EMPIRICAL_UNKNOWNS.includes(varId),
          `Runtime unknown '${varId}' must NOT be cataloged as a canonical empirical unknown`
        );
      }
    });

    it('distinguishes unseeded simulation inputs from empirical unknowns', () => {
      const unseededInputs = [
        'signup_rate',
        'onboarding_completion_rate',
        'trial_start_rate',
        'leads',
        'qualified_leads'
      ];

      for (const varId of unseededInputs) {
        assert.ok(
          !CANONICAL_EMPIRICAL_UNKNOWNS.includes(varId),
          `Unseeded input '${varId}' is a scenario input without default, NOT a canonical empirical unknown`
        );
      }
    });
  });

  describe('3. ADR Provenance & Lock Labeling (Section 18)', () => {
    const ACCEPTED_ADR_VARIABLES = [
      'business_tier_location_cap',
      'trial_activation_trigger',
      'pro_tier_location_cap',
      'free_history_retention_mode',
      'forecast_method',
      'data_provenance_mode',
      'revenue_after_electricity'
    ];

    it('verifies that ADR_LOCKED_VARIABLES contains exactly the accepted ADR policies', () => {
      const actualSorted = [...ADR_LOCKED_VARIABLES].sort();
      const expectedSorted = [...ACCEPTED_ADR_VARIABLES].sort();
      assert.deepEqual(actualSorted, expectedSorted, 'ADR locked variables must match accepted ADR-002..ADR-008');
    });

    it('verifies accepted ADR variables have ADR references in their source evidence', () => {
      const varMap = new Map(VARIABLES.map(v => [v.id, v]));

      assert.ok(varMap.get('business_tier_location_cap').sourceEvidence.includes('ADR-002'));
      assert.ok(varMap.get('trial_activation_trigger').sourceEvidence.includes('ADR-003'));
      assert.ok(varMap.get('pro_tier_location_cap').sourceEvidence.includes('ADR-004'));
      assert.ok(varMap.get('free_history_retention_mode').sourceEvidence.includes('ADR-005'));
      assert.ok(varMap.get('forecast_method').sourceEvidence.includes('ADR-006'));
      assert.ok(varMap.get('data_provenance_mode').sourceEvidence.includes('ADR-007'));
      assert.ok(varMap.get('revenue_after_electricity').sourceEvidence.includes('ADR-008'));
    });

    it('verifies pricing and non-ADR baselines are NOT falsely labeled ADR-backed', () => {
      const nonAdrVariables = [
        'pro_price_monthly',
        'business_price_monthly',
        'trial_duration_days',
        'free_plan_enabled',
        'free_recommendation_gating_mode'
      ];

      for (const varId of nonAdrVariables) {
        assert.ok(
          !ADR_LOCKED_VARIABLES.includes(varId),
          `Variable '${varId}' must NOT be in ADR_LOCKED_VARIABLES`
        );
      }
    });

    it('verifies pricing knowledge status reflects CURRENT / HYPOTHESIS rather than ADR-locked', () => {
      const varMap = new Map(VARIABLES.map(v => [v.id, v]));
      const proPrice = varMap.get('pro_price_monthly');
      const bizPrice = varMap.get('business_price_monthly');

      assert.equal(proPrice.baselineValue, 49000);
      assert.ok(proPrice.knowledgeStatus.includes('CURRENT'));
      assert.ok(!proPrice.sourceEvidence.includes('ADR-'));

      assert.equal(bizPrice.baselineValue, 149000);
      assert.ok(bizPrice.knowledgeStatus.includes('CURRENT'));
      assert.ok(!bizPrice.sourceEvidence.includes('ADR-'));
    });
  });

  describe('4. Free Recommendation Gating Flexibility (Section 19)', () => {
    it('preserves free_recommendation_gating_mode as a flexible simulation variable', () => {
      const varMap = new Map(VARIABLES.map(v => [v.id, v]));
      const gatingVar = varMap.get('free_recommendation_gating_mode');

      assert.equal(gatingVar.role, 'CONTROL');
      assert.equal(gatingVar.baselineValue, 'TOP_3_ANY_CATEGORY');
      assert.deepEqual(gatingVar.allowedValues, ['TOP_3_ANY_CATEGORY', 'DATA_COMPLETENESS_ALERTS_ONLY']);
      assert.ok(!ADR_LOCKED_VARIABLES.includes('free_recommendation_gating_mode'));
    });

    it('allows executing scenarios under both allowed gating modes', () => {
      const simulator = createSimulator();

      const scenarioTop3 = new Scenario({
        id: 'scen_top3',
        name: 'Top 3 Gating Scenario',
        overrides: { free_recommendation_gating_mode: 'TOP_3_ANY_CATEGORY' }
      });
      const resTop3 = simulator.run(scenarioTop3, { horizonMonths: 1 });
      assert.equal(resTop3.ticks[0].get('free_recommendation_gating_mode').value, 'TOP_3_ANY_CATEGORY');

      const scenarioAlerts = new Scenario({
        id: 'scen_alerts',
        name: 'Alerts Only Gating Scenario',
        overrides: { free_recommendation_gating_mode: 'DATA_COMPLETENESS_ALERTS_ONLY' }
      });
      const resAlerts = simulator.run(scenarioAlerts, { horizonMonths: 1 });
      assert.equal(resAlerts.ticks[0].get('free_recommendation_gating_mode').value, 'DATA_COMPLETENESS_ALERTS_ONLY');
    });
  });

  describe('5. Inter-Tick Unknown Safety (Section 15)', () => {
    it('propagates cash_balance = UNKNOWN to subsequent ticks without coercing to 0 or NaN', () => {
      const simulator = createSimulator();
      const scenario = new Scenario({
        id: 'scen_cash_unknown',
        name: 'Cash Unknown Scenario',
        overrides: {
          cash_balance: 'UNKNOWN',
          monthly_burn: 'UNKNOWN'
        }
      });

      const result = simulator.run(scenario, { horizonMonths: 3 });
      for (let t = 0; t <= 3; t++) {
        const cashVal = result.ticks[t].get('cash_balance');
        assert.equal(cashVal.is_unknown, true, `cash_balance at t=${t} must be UNKNOWN`);
        assert.equal(cashVal.value, 'UNKNOWN');
        assert.notEqual(cashVal.value, 0, `cash_balance at t=${t} must not coerce to 0`);
        assert.notEqual(cashVal.value, NaN);
      }
    });

    it('propagates UNKNOWN to cash_balance at t+1 if monthly_burn is UNKNOWN even if initial cash was known', () => {
      const simulator = createSimulator();
      const scenario = new Scenario({
        id: 'scen_burn_unknown',
        name: 'Burn Unknown Scenario',
        overrides: {
          cash_balance: 50000000,
          // Leave costs UNKNOWN so monthly_burn is UNKNOWN
        }
      });

      const result = simulator.run(scenario, { horizonMonths: 2 });
      // t=0 has initial cash
      assert.equal(result.ticks[0].get('cash_balance').value, 50000000);
      assert.equal(result.ticks[0].get('monthly_burn').is_unknown, true);

      // t=1 must be UNKNOWN because burn was unknown
      const cashT1 = result.ticks[1].get('cash_balance');
      assert.equal(cashT1.is_unknown, true, 'cash_balance at t=1 must be UNKNOWN');
      assert.equal(cashT1.value, 'UNKNOWN');
      assert.notEqual(cashT1.value, 0);
    });

    it('propagates active customers = UNKNOWN to subsequent ticks when retained_customer_count is UNKNOWN', () => {
      const simulator = createSimulator();
      const scenario = new Scenario({
        id: 'scen_churn_unknown',
        name: 'Churn Unknown Scenario',
        overrides: {
          active_pro_customers: 20,
          active_business_customers: 5,
          monthly_account_churn_rate: 'UNKNOWN' // Churn unknown -> retained unknown
        }
      });

      const result = simulator.run(scenario, { horizonMonths: 2 });
      assert.equal(result.ticks[0].get('active_pro_customers').value, 20);
      assert.equal(result.ticks[0].get('retained_customer_count').is_unknown, true);

      // At t=1, cohort carryover cannot assume customer retention
      const proT1 = result.ticks[1].get('active_pro_customers');
      assert.equal(proT1.is_unknown, true, 'active_pro_customers at t=1 must be UNKNOWN when retained is unknown');
      assert.equal(proT1.value, 'UNKNOWN');
      assert.notEqual(proT1.value, 0);
    });
  });
});
