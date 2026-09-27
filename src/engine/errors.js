/**
 * Custom error hierarchy for WattWise Operating Simulator Core Engine.
 */

export class SimulatorError extends Error {
  constructor(message, code = 'SIMULATOR_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class ValidationError extends SimulatorError {
  constructor(message, details = {}) {
    super(message, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class UnknownVariableError extends SimulatorError {
  constructor(variableId) {
    super(`Variable '${variableId}' is not registered in the canonical Variable Registry.`, 'UNKNOWN_VARIABLE_ERROR');
    this.variableId = variableId;
  }
}

export class CycleError extends SimulatorError {
  constructor(cyclePath) {
    const pathStr = Array.isArray(cyclePath) ? cyclePath.join(' -> ') : String(cyclePath);
    super(`Direct circular dependency detected in intra-tick evaluation graph: ${pathStr}`, 'CYCLE_ERROR');
    this.cyclePath = cyclePath;
  }
}

export class ModelExecutionError extends SimulatorError {
  constructor(message, ruleId = null, variableId = null) {
    super(message, 'MODEL_EXECUTION_ERROR');
    this.ruleId = ruleId;
    this.variableId = variableId;
  }
}
