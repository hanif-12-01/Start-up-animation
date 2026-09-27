import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, Scenario } from '../src/index.js';

describe('Family F: Customer Funnel Deterministic Expected Values', () => {
  it('should evaluate the customer funnel chain with exact fractional expected values', () => {
    const simulator = createSimulator();

    const scenario = new Scenario({
      id: 'scen_funnel_math',
      name: 'Funnel Math Test',
      overrides: {
        visitor_count: 1000,
        signup_rate: 0.08, // 80 signups
        onboarding_completion_rate: 0.50, // 40 onboarded
        trial_start_rate: 0.25, // 10 trials
        trial_to_paid_conversion_rate: 0.05, // 0.5 trial conversions
        leads: 20,
        sales_conversion_rate: 0.15 // 3.0 sales conversions
      }
    });

    const result = simulator.run(scenario);
    const state0 = result.ticks[0];

    assert.equal(state0.get('signup_count').value, 80.0);
    assert.equal(state0.get('onboarded_user_count').value, 40.0);
    assert.equal(state0.get('trial_user_count').value, 10.0);
    assert.equal(state0.get('new_paid_customer_count').value, 3.5); // 0.5 + 3.0 = 3.5 expected customers
  });

  it('should calculate CAC from marketing spend and expected new paid customers', () => {
    const simulator = createSimulator();

    const scenario = new Scenario({
      id: 'scen_cac_test',
      name: 'CAC Test',
      overrides: {
        visitor_count: 1000,
        signup_rate: 0.08,
        onboarding_completion_rate: 0.50,
        trial_start_rate: 0.25,
        trial_to_paid_conversion_rate: 0.05,
        leads: 20,
        sales_conversion_rate: 0.15, // new_paid_customer_count = 3.5
        marketing_spend: 3500000 // Rp3.500.000
      }
    });

    const result = simulator.run(scenario);
    const state0 = result.ticks[0];

    // CAC = Rp3.500.000 / 3.5 customers = Rp1.000.000/customer
    assert.equal(state0.get('cac').value, 1000000);
  });
});
