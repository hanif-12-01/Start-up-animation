import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, Scenario, KnowledgeStatus } from '../src/index.js';

describe('Benchmark Scenarios Suite', () => {
  describe('Scenario A: Canonical Baseline (Current Empirical State)', () => {
    test('executes 6-month simulation preserving all empirical unknowns without coercing to zero', () => {
      const simulator = createSimulator();
      const result = simulator.run(null, { horizonMonths: 6 });

      assert.equal(result.ticks.length, 7, 'Must have 7 ticks for 0..6 months');

      for (let t = 0; t <= 6; t++) {
        const state = result.ticks[t];

        // 1. Exactly the 10 Canonical Empirical Unknowns must remain strictly UNKNOWN
        assert.equal(state.get('monthly_account_churn_rate').is_unknown, true);
        assert.equal(state.get('trial_to_paid_conversion_rate').is_unknown, true);
        assert.equal(state.get('cac').is_unknown, true);
        assert.equal(state.get('support_tickets_per_customer').is_unknown, true);
        assert.equal(state.get('support_cost_per_ticket').is_unknown, true);
        assert.equal(state.get('support_tickets_per_location').is_unknown, true);
        assert.equal(state.get('visitor_count').is_unknown, true);
        assert.equal(state.get('forecast_error_rate').is_unknown, true);
        assert.equal(state.get('database_cost').is_unknown, true);
        assert.equal(state.get('average_locations_per_business_account').is_unknown, true);

        // 2. Unseeded simulation inputs without defaults remain UNKNOWN
        assert.equal(state.get('signup_rate').is_unknown, true);
        assert.equal(state.get('onboarding_completion_rate').is_unknown, true);
        assert.equal(state.get('trial_start_rate').is_unknown, true);
        assert.equal(state.get('leads').is_unknown, true);
        assert.equal(state.get('qualified_leads').is_unknown, true);

        // 3. Derived runtime unknowns arising through rule evaluation remain UNKNOWN
        assert.equal(state.get('signup_count').is_unknown, true);
        assert.equal(state.get('onboarded_user_count').is_unknown, true);
        assert.equal(state.get('trial_user_count').is_unknown, true);
        assert.equal(state.get('new_paid_customer_count').is_unknown, true);
        assert.equal(state.get('total_mrr').is_unknown, true);
        assert.equal(state.get('arr').is_unknown, true);
        assert.equal(state.get('monthly_burn').is_unknown, true);
        assert.equal(state.get('cash_runway_months').is_unknown, true);

        // 4. Accepted baselines must remain immutable
        assert.equal(state.get('free_plan_enabled').value, true);
        assert.equal(state.get('pro_tier_location_cap').value, 3);
        assert.equal(state.get('business_tier_location_cap').value, 50);
        assert.equal(state.get('pro_price_monthly').value, 49000);
        assert.equal(state.get('business_price_monthly').value, 149000);
      }
    });
  });

  describe('Scenario B: Conservative Small Business Organic Adoption (Venture Defense)', () => {
    test('executes 6-month deterministic trajectory with solvency decline', () => {
      const simulator = createSimulator();

      const scenarioB = new Scenario({
        id: 'scenario_b_conservative',
        name: 'Conservative Small Business Adoption',
        description: 'Venture defense baseline with organic traction and lean OpEx',
        overrides: {
          visitor_count: 500,
          signup_rate: 0.05,
          onboarding_completion_rate: 0.60,
          trial_start_rate: 0.70,
          trial_to_paid_conversion_rate: 0.20,
          monthly_account_churn_rate: 0.08,
          active_pro_customers: 25,
          active_business_customers: 2,
          average_locations_per_business_account: 3,
          hosting_cost: 320000,
          database_cost: 250000,
          inference_cost: 0,
          payment_gateway_cost: 50000,
          customer_support_cost: 500000,
          marketing_spend: 2000000,
          cash_balance: 30000000
        }
      });

      const result = simulator.run(scenarioB, { horizonMonths: 6 });
      assert.equal(result.ticks.length, 7);

      // Month 0 assertions
      const t0 = result.ticks[0];
      const expectedProMrr = 25 * 49000; // 1,225,000
      const expectedBizMrr = 2 * 149000; // 298,000
      const expectedTotalMrr = expectedProMrr + expectedBizMrr; // 1,523,000

      assert.equal(t0.get('pro_mrr').value, expectedProMrr);
      assert.equal(t0.get('business_mrr').value, expectedBizMrr);
      assert.equal(t0.get('total_mrr').value, expectedTotalMrr);
      assert.equal(t0.get('arr').value, expectedTotalMrr * 12);
      assert.equal(t0.get('total_paid_customers').value, 27);

      // Verify burn and runway
      const opex = 320000 + 250000 + 0 + 50000 + 500000; // COGS: 1,120,000
      const totalSpend = opex + 2000000; // 3,120,000
      const expectedBurn = totalSpend - expectedTotalMrr; // 3,120,000 - 1,523,000 = 1,597,000
      assert.equal(t0.get('monthly_burn').value, expectedBurn);

      const expectedRunway = 30000000 / expectedBurn;
      assert.ok(Math.abs(t0.get('cash_runway_months').value - expectedRunway) < 0.1);

      // Verify cash balance declines monotonically over time
      let prevCash = t0.get('cash_balance').value;
      for (let t = 1; t <= 6; t++) {
        const currentCash = result.ticks[t].get('cash_balance').value;
        assert.ok(currentCash < prevCash, `Cash at t=${t} (${currentCash}) must be less than t=${t-1} (${prevCash})`);
        prevCash = currentCash;
      }
    });
  });

  describe('Scenario C: Aggressive Multi-Branch Growth (Scale Stress)', () => {
    test('executes 12-month scale stress test with multi-branch density and high MRR', () => {
      const simulator = createSimulator();

      const scenarioC = new Scenario({
        id: 'scenario_c_aggressive_growth',
        name: 'Aggressive Multi-Branch Growth',
        description: 'Scale stress test with 30 multi-branch businesses at 25 locations each',
        overrides: {
          active_pro_customers: 150,
          active_business_customers: 30,
          average_locations_per_business_account: 25,
          monthly_account_churn_rate: 0.03,
          hosting_cost: 500000,
          database_cost: 1500000,
          inference_cost: 0,
          payment_gateway_cost: 250000,
          customer_support_cost: 2000000,
          marketing_spend: 8000000,
          cash_balance: 100000000
        }
      });

      const result = simulator.run(scenarioC, { horizonMonths: 12 });
      assert.equal(result.ticks.length, 13, 'Must simulate 0..12 months');

      const t0 = result.ticks[0];
      const proMrr = 150 * 49000; // 7,350,000
      const bizMrr = 30 * 149000; // 4,470,000
      const totalMrr = proMrr + bizMrr; // 11,820,000
      const arr = totalMrr * 12; // 141,840,000

      assert.equal(t0.get('pro_mrr').value, proMrr);
      assert.equal(t0.get('business_mrr').value, bizMrr);
      assert.equal(t0.get('total_mrr').value, totalMrr);
      assert.equal(t0.get('arr').value, arr);
      assert.equal(t0.get('total_paid_customers').value, 180);

      // Verify location dilution
      // Business price per location = 149,000 / 25 = 5,960 IDR/location/mo
      const bizLocArpa = t0.get('arpa_per_location').value;
      assert.ok(Math.abs(bizLocArpa - 5960) < 0.1, `Business ARPA/loc should be 5,960 IDR, got ${bizLocArpa}`);

      // Verify all 13 ticks have valid numbers without NaN or null
      for (let t = 0; t <= 12; t++) {
        const state = result.ticks[t];
        const mrrVal = state.get('total_mrr').value;
        const burnVal = state.get('monthly_burn').value;
        const cashVal = state.get('cash_balance').value;

        assert.ok(!Number.isNaN(mrrVal), `MRR at t=${t} must not be NaN`);
        assert.ok(!Number.isNaN(burnVal), `Burn at t=${t} must not be NaN`);
        assert.ok(!Number.isNaN(cashVal), `Cash at t=${t} must not be NaN`);
      }
    });
  });
});
