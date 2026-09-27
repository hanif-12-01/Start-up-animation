/**
 * Execution Trace — Records causal explanation trees and evaluation steps for every simulated variable.
 */

export class ExecutionTrace {
  constructor() {
    this._entries = [];
  }

  /**
   * Records an evaluation step.
   * @param {Object} entry
   */
  record({
    tick = 0,
    ruleId,
    outputVariable,
    inputValues = {},
    result,
    explanation = ''
  }) {
    this._entries.push({
      tick,
      ruleId,
      outputVariable,
      inputValues: { ...inputValues },
      result,
      explanation
    });
  }

  getAll() {
    return [...this._entries];
  }

  getForVariable(variableId, tick = null) {
    return this._entries.filter(e => {
      const matchVar = e.outputVariable === variableId;
      const matchTick = tick === null || e.tick === tick;
      return matchVar && matchTick;
    });
  }

  /**
   * Generates a human-readable explanation of why a variable received its value.
   * @param {string} variableId
   * @param {number} [tick=0]
   * @returns {string}
   */
  explain(variableId, tick = 0) {
    const entries = this.getForVariable(variableId, tick);
    if (entries.length === 0) {
      return `Variable '${variableId}' has no recorded evaluation entry at tick ${tick} (likely an input or un-evaluated parameter).`;
    }

    const latest = entries[entries.length - 1];
    const res = latest.result;

    if (res.is_unknown) {
      return `Variable '${variableId}' is UNKNOWN at tick ${tick}. Reason: ${res.explanation || 'One or more upstream inputs are UNKNOWN.'}`;
    }

    const inputSummary = Object.entries(latest.inputValues)
      .map(([k, v]) => `${k} = ${v?.value !== undefined ? v.value : v}`)
      .join(', ');

    return `Variable '${variableId}' = ${res.value} ${res.unit} (Rule: ${latest.ruleId}) because [${inputSummary}]. ${latest.explanation}`;
  }
}
