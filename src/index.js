/**
 * WattWise Operating Simulator — Core Simulation Engine Entry Point
 */

import { VariableRegistry } from './engine/registry.js';
import { RuleRegistry } from './engine/rule-registry.js';
import { DependencyResolver } from './engine/dependency-resolver.js';
import { SimulationEngine } from './engine/simulator.js';
import { Scenario, ScenarioManager } from './engine/scenario.js';
import { SimulationValue, KnowledgeStatus, ConfidenceRating, createUnknownValue } from './engine/value.js';
import {
  SimulatorError,
  ValidationError,
  UnknownVariableError,
  CycleError,
  ModelExecutionError
} from './engine/errors.js';

import { VARIABLES } from './model/variables.js';
import { CANONICAL_BASELINE } from './model/baseline.js';
import { RULES } from './model/rules.js';

/**
 * Creates and initializes a fully wired SimulationEngine with canonical variables and rules.
 * @param {Object} [customBaseline]
 * @returns {SimulationEngine}
 */
export function createSimulator(customBaseline = null) {
  const registry = new VariableRegistry();
  for (const v of VARIABLES) {
    registry.register(v);
  }

  const ruleRegistry = new RuleRegistry();
  for (const r of RULES) {
    ruleRegistry.register(r);
  }

  const resolver = new DependencyResolver();

  const baseline = customBaseline ? { ...CANONICAL_BASELINE, ...customBaseline } : CANONICAL_BASELINE;

  return new SimulationEngine({
    registry,
    ruleRegistry,
    dependencyResolver: resolver,
    defaultBaseline: baseline
  });
}

export {
  VariableRegistry,
  RuleRegistry,
  DependencyResolver,
  SimulationEngine,
  Scenario,
  ScenarioManager,
  SimulationValue,
  KnowledgeStatus,
  ConfidenceRating,
  createUnknownValue,
  SimulatorError,
  ValidationError,
  UnknownVariableError,
  CycleError,
  ModelExecutionError,
  VARIABLES,
  CANONICAL_BASELINE,
  RULES
};

export default createSimulator;
