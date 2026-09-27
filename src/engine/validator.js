/**
 * Scenario Validator — Validates that parameter overrides satisfy variable registry definitions.
 */

import { ValidationError, UnknownVariableError } from './errors.js';

export class ScenarioValidator {
  /**
   * @param {import('./registry.js').VariableRegistry} registry
   */
  constructor(registry) {
    this.registry = registry;
  }

  /**
   * Validates all overrides in a scenario against registered metadata.
   * @param {import('./scenario.js').Scenario|Object} scenario
   * @throws {ValidationError|UnknownVariableError}
   */
  validate(scenario) {
    const overrides = scenario.overrides || scenario;

    for (const [key, val] of Object.entries(overrides)) {
      if (!this.registry.has(key)) {
        throw new UnknownVariableError(key);
      }

      const meta = this.registry.get(key);

      // UNKNOWN is allowed as a first-class state for non-constant variables
      if (val === 'UNKNOWN' || val === null || val === undefined) {
        if (meta.role === 'CONSTANT') {
          throw new ValidationError(`Constant variable '${key}' cannot be overridden with UNKNOWN.`, {
            variableId: key,
            value: val
          });
        }
        continue;
      }

      // Type checking
      switch (meta.dataType) {
        case 'boolean':
          if (typeof val !== 'boolean') {
            throw new ValidationError(`Variable '${key}' expected boolean, received ${typeof val} (${val}).`, {
              variableId: key,
              expectedType: 'boolean',
              value: val
            });
          }
          break;

        case 'integer':
          if (typeof val !== 'number' || !Number.isInteger(val)) {
            throw new ValidationError(`Variable '${key}' expected integer, received ${val}.`, {
              variableId: key,
              expectedType: 'integer',
              value: val
            });
          }
          break;

        case 'float':
          if (typeof val !== 'number' || Number.isNaN(val) || !Number.isFinite(val)) {
            throw new ValidationError(`Variable '${key}' expected valid float, received ${val}.`, {
              variableId: key,
              expectedType: 'float',
              value: val
            });
          }
          break;

        case 'enum':
          if (typeof val !== 'string') {
            throw new ValidationError(`Variable '${key}' expected enum string, received ${typeof val}.`, {
              variableId: key,
              expectedType: 'enum',
              value: val
            });
          }
          if (Array.isArray(meta.allowedValues) && !meta.allowedValues.includes(val)) {
            throw new ValidationError(`Variable '${key}' enum value '${val}' is not in allowed set: [${meta.allowedValues.join(', ')}].`, {
              variableId: key,
              allowedValues: meta.allowedValues,
              value: val
            });
          }
          break;

        case 'string':
          if (typeof val !== 'string') {
            throw new ValidationError(`Variable '${key}' expected string, received ${typeof val}.`, {
              variableId: key,
              expectedType: 'string',
              value: val
            });
          }
          break;

        default:
          break;
      }

      // Boundary checking
      if (typeof val === 'number') {
        if (meta.minimum !== null && meta.minimum !== undefined && val < meta.minimum) {
          throw new ValidationError(`Variable '${key}' value ${val} is below allowed minimum ${meta.minimum}.`, {
            variableId: key,
            minimum: meta.minimum,
            value: val
          });
        }

        if (meta.maximum !== null && meta.maximum !== undefined && val > meta.maximum) {
          throw new ValidationError(`Variable '${key}' value ${val} exceeds allowed maximum ${meta.maximum}.`, {
            variableId: key,
            maximum: meta.maximum,
            value: val
          });
        }
      }
    }

    return true;
  }
}
