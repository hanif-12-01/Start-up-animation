import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, Scenario } from '../src/index.js';

describe('Family B: Scenario Overrides & Baseline Immutability', () => {
  it('should apply valid scenario overrides without mutating baseline', () => {
    const simulator = createSimulator();

    // Verify initial baseline state
    assert.equal(simulator.defaultBaseline.get('business_tier_location_cap').value, 50);
    assert.equal(simulator.defaultBaseline.get('visitor_count').is_unknown, true);

    const scenario = new Scenario({
      id: 'scen_test_1',
      name: 'Test Scenario',
      overrides: {
        business_tier_location_cap: 10,
        visitor_count: 500,
        signup_rate: 0.10
      }
    });

    const runResult = simulator.run(scenario);
    const state0 = runResult.ticks[0];

    // State receives overrides
    assert.equal(state0.get('business_tier_location_cap').value, 10);
    assert.equal(state0.get('visitor_count').value, 500);
    assert.equal(state0.get('visitor_count').is_unknown, false);
    assert.equal(state0.get('visitor_count').provenance, 'SCENARIO_OVERRIDE');

    // Baseline remains completely unchanged!
    assert.equal(simulator.defaultBaseline.get('business_tier_location_cap').value, 50);
    assert.equal(simulator.defaultBaseline.get('visitor_count').is_unknown, true);
  });

  it('should guarantee scenario isolation between consecutive runs', () => {
    const simulator = createSimulator();

    const scenarioA = new Scenario({
      id: 'scen_a',
      name: 'Scenario A',
      overrides: {
        business_tier_location_cap: 5,
        visitor_count: 200
      }
    });

    const scenarioB = new Scenario({
      id: 'scen_b',
      name: 'Scenario B',
      overrides: {
        business_tier_location_cap: 25,
        visitor_count: 3000
      }
    });

    const runA = simulator.run(scenarioA);
    const runB = simulator.run(scenarioB);

    assert.equal(runA.ticks[0].get('business_tier_location_cap').value, 5);
    assert.equal(runA.ticks[0].get('visitor_count').value, 200);

    assert.equal(runB.ticks[0].get('business_tier_location_cap').value, 25);
    assert.equal(runB.ticks[0].get('visitor_count').value, 3000);

    // Default baseline remains untouched
    const runDefault = simulator.run();
    assert.equal(runDefault.ticks[0].get('business_tier_location_cap').value, 50);
    assert.equal(runDefault.ticks[0].get('visitor_count').is_unknown, true);
  });
});
