import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, Scenario } from '../src/index.js';

describe('Family D: Strict Determinism & Zero Stochastic Noise', () => {
  it('should produce bit-for-bit identical results on repeated runs of identical scenarios', () => {
    const simulator = createSimulator();

    const testScenario = new Scenario({
      id: 'scen_deterministic',
      name: 'Deterministic Test Scenario',
      overrides: {
        active_pro_customers: 73,
        active_business_customers: 14,
        average_locations_per_business_account: 6.5,
        hosting_cost: 350000,
        database_cost: 215000,
        support_cost_per_ticket: 25000,
        support_tickets_per_customer: 0.18,
        support_tickets_per_location: 0.08,
        support_capacity: 120,
        marketing_spend: 3500000,
        cash_balance: 75000000,
        visitor_count: 1450,
        signup_rate: 0.075,
        onboarding_completion_rate: 0.52,
        trial_start_rate: 0.28,
        trial_to_paid_conversion_rate: 0.042,
        leads: 35,
        sales_conversion_rate: 0.14,
        monthly_account_churn_rate: 0.048
      }
    });

    const run1 = simulator.run(testScenario, { horizonMonths: 6 });
    const run2 = simulator.run(testScenario, { horizonMonths: 6 });

    assert.equal(run1.ticks.length, run2.ticks.length, 'Horizon lengths must be identical');

    for (let t = 0; t < run1.ticks.length; t++) {
      const state1 = run1.ticks[t];
      const state2 = run2.ticks[t];

      assert.equal(state1.size, state2.size, `State sizes must match at tick ${t}`);

      for (const [key, val1] of state1.entries()) {
        const val2 = state2.get(key);
        assert.ok(val2, `Key ${key} must exist in both runs`);
        assert.equal(val1.value, val2.value, `Value mismatch for ${key} at tick ${t}: ${val1.value} !== ${val2.value}`);
        assert.equal(val1.knowledge_status, val2.knowledge_status, `Status mismatch for ${key} at tick ${t}`);
        assert.equal(val1.confidence, val2.confidence, `Confidence mismatch for ${key} at tick ${t}`);
        assert.equal(val1.explanation, val2.explanation, `Explanation mismatch for ${key} at tick ${t}`);
      }
    }
  });
});
