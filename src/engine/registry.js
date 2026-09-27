/**
 * Variable Registry — Stores complete metadata specifications for all simulator variables.
 */

import { UnknownVariableError } from './errors.js';

export class VariableRegistry {
  constructor() {
    this._variables = new Map();
  }

  /**
   * Registers a variable definition.
   * @param {Object} def
   */
  register(def) {
    if (!def.id) {
      throw new Error('Variable definition must provide an id.');
    }
    if (this._variables.has(def.id)) {
      throw new Error(`Variable '${def.id}' is already registered.`);
    }

    const normalized = {
      id: def.id,
      name: def.name || def.id,
      domain: def.domain || 'GENERAL',
      description: def.description || '',
      role: def.role || 'INPUT', // CONTROL, INPUT, STATE, DERIVED, OUTPUT, CONSTANT
      dataType: def.dataType || 'float', // boolean, integer, float, enum, string
      unit: def.unit || '',
      knowledgeStatus: def.knowledgeStatus || 'SIMULATION_ASSUMPTION',
      baselineValue: def.baselineValue !== undefined ? def.baselineValue : 'UNKNOWN',
      allowedValues: def.allowedValues || null,
      minimum: def.minimum !== undefined ? def.minimum : null,
      maximum: def.maximum !== undefined ? def.maximum : null,
      editable: def.editable !== false,
      implementationStatus: def.implementationStatus || 'SIMULATOR_SPEC',
      notes: def.notes || ''
    };

    this._variables.set(def.id, Object.freeze(normalized));
    return this;
  }

  /**
   * Retrieves variable metadata by ID.
   * @param {string} id
   * @returns {Object}
   */
  get(id) {
    const v = this._variables.get(id);
    if (!v) {
      throw new UnknownVariableError(id);
    }
    return v;
  }

  has(id) {
    return this._variables.has(id);
  }

  getAll() {
    return Array.from(this._variables.values());
  }

  getIds() {
    return Array.from(this._variables.keys());
  }

  filterByDomain(domain) {
    return this.getAll().filter(v => v.domain === domain);
  }

  filterByRole(role) {
    return this.getAll().filter(v => v.role === role);
  }

  size() {
    return this._variables.size;
  }
}
