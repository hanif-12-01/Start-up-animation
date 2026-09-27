import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, Scenario } from '../src/index.js';

describe('Family E: Revenue Rules & Accounting Identities', () => {
  it('should accurately calculate Pro MRR, Business MRR, Total MRR, and ARR', () => {
    const simulator = createSimulator();

    const scenario = new Scenario({
      id: 'scen_rev_basic',
      name: 'Revenue Calculation Test',
      overrides: {
        active_pro_customers: 100, // 100 * Rp49.000 = Rp4.900.000
        active_business_customers: 10 // 10 * Rp149.000 = Rp1.490.000
      }
    });

    const result = simulator.run(scenario);
    const state0 = result.ticks[0];

    assert.equal(state0.get('total_paid_customers').value, 110);
    assert.equal(state0.get('pro_mrr').value, 4900000);
    assert.equal(state0.get('business_mrr').value, 1490000);
    assert.equal(state0.get('total_mrr').value, 6390000);
    assert.equal(state0.get('arr').value, 6390000 * 12); // 76,680,000

    const expectedArpa = 6390000 / 110;
    assert.ok(Math.abs(state0.get('arpa').value - expectedArpa) < 0.001);
  });

  it('should calculate location revenue dilution on Business tier (arpa_per_location)', () => {
    const simulator = createSimulator();

    const scenario = new Scenario({
      id: 'scen_loc_dilution',
      name: 'Location Dilution Test',
      overrides: {
        active_pro_customers: 0,
        active_business_customers: 1, // 1 customer @ Rp149.000
        average_locations_per_business_account: 50 // max cap ADR-002
      }
    });

    const result = simulator.run(scenario);
    const state0 = result.ticks[0];

    // Rp149.000 / 50 locations = Rp2.980/location/month
    assert.equal(state0.get('business_mrr').value, 149000);
    assert.equal(state0.get('arpa_per_location').value, 2980);
  });

  it('should gracefully handle zero customers without NaN or division by zero', () => {
    const simulator = createSimulator();

    const scenario = new Scenario({
      id: 'scen_zero_rev',
      name: 'Zero Customers Test',
      overrides: {
        active_pro_customers: 0,
        active_business_customers: 0,
        average_locations_per_business_account: 5
      }
    });

    const result = simulator.run(scenario);
    const state0 = result.ticks[0];

    assert.equal(state0.get('total_paid_customers').value, 0);
    assert.equal(state0.get('pro_mrr').value, 0);
    assert.equal(state0.get('business_mrr').value, 0);
    assert.equal(state0.get('total_mrr').value, 0);
    assert.equal(state0.get('arr').value, 0);
    assert.equal(state0.get('arpa').value, 0.0);
    assert.equal(state0.get('arpa_per_location').value, 0.0);
  });
});
