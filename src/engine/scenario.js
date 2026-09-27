/**
 * Scenario Model & Manager — Encapsulates parameter overrides and benchmark scenario definitions.
 */

export class Scenario {
  /**
   * @param {Object} options
   * @param {string} options.id
   * @param {string} options.name
   * @param {string} [options.description]
   * @param {Object} [options.overrides]
   * @param {Object} [options.metadata]
   */
  constructor({
    id,
    name,
    description = '',
    overrides = {},
    metadata = {}
  }) {
    if (!id || !name) {
      throw new Error('Scenario requires both id and name.');
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.overrides = Object.freeze({ ...overrides });
    this.metadata = Object.freeze({ ...metadata });

    Object.freeze(this);
  }

  getOverride(variableId) {
    return this.overrides[variableId];
  }

  hasOverride(variableId) {
    return Object.prototype.hasOwnProperty.call(this.overrides, variableId);
  }

  getOverrideKeys() {
    return Object.keys(this.overrides);
  }
}

export class ScenarioManager {
  constructor() {
    this._scenarios = new Map();
  }

  register(scenario) {
    if (!(scenario instanceof Scenario)) {
      throw new Error('scenario must be an instance of Scenario');
    }
    this._scenarios.set(scenario.id, scenario);
    return this;
  }

  get(id) {
    return this._scenarios.get(id);
  }

  has(id) {
    return this._scenarios.has(id);
  }

  getAll() {
    return Array.from(this._scenarios.values());
  }
}
