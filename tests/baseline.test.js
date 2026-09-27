import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, CANONICAL_BASELINE, VARIABLES } from '../src/index.js';

describe('Family A: Baseline Loading & Golden Test', () => {
  it('should register exactly 67 variables from canonical dictionary', () => {
    const simulator = createSimulator();
    assert.equal(simulator.registry.size(), 67, 'Expected 67 variables in registry');
  });

  it('should pass the Golden Baseline Test (ADR-002 through ADR-008)', () => {
    const simulator = createSimulator();
    const result = simulator.run();
    const state0 = result.ticks[0];

    // ADR-002: Business tier location cap = 50
    assert.equal(state0.get('business_tier_location_cap').value, 50);

    // ADR-004: Pro tier location cap = 3
    assert.equal(state0.get('pro_tier_location_cap').value, 3);

    // ADR-003: Trial activation trigger = EXPLICIT
    assert.equal(state0.get('trial_activation_trigger').value, 'EXPLICIT');

    // ADR-005: Free history retention mode = ROLLING_3_MONTH_WINDOW
    assert.equal(state0.get('free_history_retention_mode').value, 'ROLLING_3_MONTH_WINDOW');

    // ADR-006: Forecast method = DETERMINISTIC_HEURISTIC
    assert.equal(state0.get('forecast_method').value, 'DETERMINISTIC_HEURISTIC');

    // ADR-007: Data provenance mode = STRICT_TAGGED
    assert.equal(state0.get('data_provenance_mode').value, 'STRICT_TAGGED');

    // ADR-008: Canonical metric = revenue_after_electricity
    assert.ok(state0.has('revenue_after_electricity'));
  });

  it('should ensure all 10 empirical unknowns default to UNKNOWN in baseline', () => {
    const simulator = createSimulator();
    const result = simulator.run();
    const state0 = result.ticks[0];

    const tenUnknowns = [
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

    for (const varId of tenUnknowns) {
      const val = state0.get(varId);
      assert.ok(val, `Expected variable ${varId} to be present in state`);
      assert.equal(val.is_unknown, true, `Expected ${varId} to be UNKNOWN`);
      assert.equal(val.value, 'UNKNOWN', `Expected ${varId} value to be 'UNKNOWN'`);
      assert.equal(val.knowledge_status, 'UNKNOWN', `Expected ${varId} status to be 'UNKNOWN'`);
    }
  });
});
