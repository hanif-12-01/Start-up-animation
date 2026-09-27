import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSimulator,
  Scenario,
  ValidationError,
  UnknownVariableError,
  SimulatorError
} from '../src/index.js';

describe('Family G: Validation Layer & Error Hierarchy', () => {
  it('should reject unknown variable keys with UnknownVariableError', () => {
    const simulator = createSimulator();

    const invalidScenario = new Scenario({
      id: 'scen_bad_key',
      name: 'Bad Key Scenario',
      overrides: {
        non_existent_fake_variable: 123
      }
    });

    assert.throws(
      () => simulator.run(invalidScenario),
      (err) => {
        assert.ok(err instanceof UnknownVariableError);
        assert.ok(err instanceof SimulatorError);
        assert.equal(err.code, 'UNKNOWN_VARIABLE_ERROR');
        assert.ok(err.message.includes('non_existent_fake_variable'));
        return true;
      }
    );
  });

  it('should reject invalid data types with ValidationError', () => {
    const simulator = createSimulator();

    // pro_tier_location_cap must be integer, not string
    const badTypeScenario = new Scenario({
      id: 'scen_bad_type',
      name: 'Bad Type Scenario',
      overrides: {
        pro_tier_location_cap: 'three'
      }
    });

    assert.throws(
      () => simulator.run(badTypeScenario),
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.ok(err.message.includes('pro_tier_location_cap'));
        return true;
      }
    );
  });

  it('should reject invalid enums with ValidationError', () => {
    const simulator = createSimulator();

    const badEnumScenario = new Scenario({
      id: 'scen_bad_enum',
      name: 'Bad Enum Scenario',
      overrides: {
        forecast_method: 'MAGIC_AI_QUANTUM_FORECAST'
      }
    });

    assert.throws(
      () => simulator.run(badEnumScenario),
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.ok(err.message.includes('MAGIC_AI_QUANTUM_FORECAST'));
        return true;
      }
    );
  });

  it('should reject values below minimum boundary with ValidationError', () => {
    const simulator = createSimulator();

    // business_tier_location_cap minimum is 1
    const badMinScenario = new Scenario({
      id: 'scen_bad_min',
      name: 'Bad Min Scenario',
      overrides: {
        business_tier_location_cap: 0
      }
    });

    assert.throws(
      () => simulator.run(badMinScenario),
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.ok(err.message.includes('below allowed minimum'));
        return true;
      }
    );
  });

  it('should reject values above maximum boundary with ValidationError', () => {
    const simulator = createSimulator();

    // business_tier_location_cap maximum is 50
    const badMaxScenario = new Scenario({
      id: 'scen_bad_max',
      name: 'Bad Max Scenario',
      overrides: {
        business_tier_location_cap: 100
      }
    });

    assert.throws(
      () => simulator.run(badMaxScenario),
      (err) => {
        assert.ok(err instanceof ValidationError);
        assert.equal(err.code, 'VALIDATION_ERROR');
        assert.ok(err.message.includes('exceeds allowed maximum'));
        return true;
      }
    );
  });
});
