/**
 * Rule Registry — Stores formal executable rules per the Simulation Rulebook.
 */

export class RuleRegistry {
  constructor() {
    this._rules = new Map();
  }

  /**
   * Registers an executable rule.
   * @param {Object} rule
   */
  register(rule) {
    if (!rule.id || !rule.outputVariable || !rule.evaluate) {
      throw new Error('Rule must provide id, outputVariable, and an evaluate function.');
    }
    if (this._rules.has(rule.id)) {
      throw new Error(`Rule '${rule.id}' is already registered.`);
    }

    const normalized = {
      id: rule.id,
      outputVariable: rule.outputVariable,
      inputVariables: rule.inputVariables || [],
      ruleClass: rule.ruleClass || 'MODEL_ASSUMPTION',
      description: rule.description || '',
      evaluate: rule.evaluate,
      unit: rule.unit || '',
      confidence: rule.confidence || 'HIGH',
      knowledgeStatus: rule.knowledgeStatus || null,
      notes: rule.notes || ''
    };

    this._rules.set(rule.id, Object.freeze(normalized));
    return this;
  }

  get(id) {
    return this._rules.get(id);
  }

  has(id) {
    return this._rules.has(id);
  }

  getAll() {
    return Array.from(this._rules.values());
  }

  getRulesForOutput(variableId) {
    return this.getAll().filter(r => r.outputVariable === variableId);
  }

  size() {
    return this._rules.size;
  }
}
