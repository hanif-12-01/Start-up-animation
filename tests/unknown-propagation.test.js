import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, Scenario } from '../src/index.js';

describe('Family C: UNKNOWN Propagation & Zero Coercion Prevention', () => {
  it('should propagate UNKNOWN through customer funnel when visitor_count is unknown', () => {
    const simulator = createSimulator();

    // Baseline has visitor_count = UNKNOWN
    const runResult = simulator.run();
    const state0 = runResult.ticks[0];

    const signupCount = state0.get('signup_count');
    assert.equal(signupCount.is_unknown, true, 'signup_count must be UNKNOWN');
    assert.equal(signupCount.value, 'UNKNOWN');
    assert.notEqual(signupCount.value, 0, 'Must NOT coerce to 0');
    assert.ok(signupCount.explanation.includes('mandatory input(s)'));

    const onboardedCount = state0.get('onboarded_user_count');
    assert.equal(onboardedCount.is_unknown, true, 'onboarded_user_count must be UNKNOWN');

    const trialCount = state0.get('trial_user_count');
    assert.equal(trialCount.is_unknown, true, 'trial_user_count must be UNKNOWN');
  });

  it('should propagate UNKNOWN to cash_runway_months when cash_balance is UNKNOWN', () => {
    const simulator = createSimulator();

    // Set MRR and OpEx so monthly_burn is calculable, but keep cash_balance UNKNOWN
    const scenario = new Scenario({
      id: 'scen_runway_unknown',
      name: 'Runway Unknown Test',
      overrides: {
        active_pro_customers: 10,
        active_business_customers: 2,
        hosting_cost: 350000,
        database_cost: 200000,
        customer_support_cost: 100000,
        marketing_spend: 500000,
        cash_balance: 'UNKNOWN' // explicit empirical unknown
      }
    });

    const runResult = simulator.run(scenario);
    const state0 = runResult.ticks[0];

    const runway = state0.get('cash_runway_months');
    assert.equal(runway.is_unknown, true, 'cash_runway_months must be UNKNOWN');
    assert.equal(runway.value, 'UNKNOWN');
    assert.notEqual(runway.value, 0, 'Runway must never silently coerce to 0 months');
    assert.ok(runway.explanation.includes('mandatory input(s)'));
  });

  it('should propagate UNKNOWN to cogs and gross_profit when database_cost is UNKNOWN', () => {
    const simulator = createSimulator();

    const scenario = new Scenario({
      id: 'scen_cogs_unknown',
      name: 'COGS Unknown Test',
      overrides: {
        active_pro_customers: 100,
        hosting_cost: 350000,
        database_cost: 'UNKNOWN', // missing cloud DB invoice
        customer_support_cost: 500000
      }
    });

    const runResult = simulator.run(scenario);
    const state0 = runResult.ticks[0];

    const cogs = state0.get('cogs');
    assert.equal(cogs.is_unknown, true, 'COGS must be UNKNOWN');
    assert.equal(cogs.value, 'UNKNOWN');

    const gp = state0.get('gross_profit');
    assert.equal(gp.is_unknown, true, 'gross_profit must be UNKNOWN if COGS is unknown');
    assert.equal(gp.value, 'UNKNOWN');
  });
});
