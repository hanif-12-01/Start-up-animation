/**
 * Simulation Engine — Core deterministic simulation runner.
 */

import { SimulationValue, KnowledgeStatus, ConfidenceRating, createUnknownValue } from './value.js';
import { ScenarioValidator } from './validator.js';
import { ExecutionTrace } from './trace.js';

export class SimulationEngine {
  /**
   * @param {Object} options
   * @param {import('./registry.js').VariableRegistry} options.registry
   * @param {import('./rule-registry.js').RuleRegistry} options.ruleRegistry
   * @param {import('./dependency-resolver.js').DependencyResolver} options.dependencyResolver
   * @param {Map<string, SimulationValue>|Object} options.defaultBaseline
   */
  constructor({
    registry,
    ruleRegistry,
    dependencyResolver,
    defaultBaseline
  }) {
    this.registry = registry;
    this.ruleRegistry = ruleRegistry;
    this.dependencyResolver = dependencyResolver;
    this.validator = new ScenarioValidator(registry);

    // Normalize baseline into an immutable Map of SimulationValues
    this.defaultBaseline = new Map();
    const baselineSource = defaultBaseline instanceof Map ? defaultBaseline : new Map(Object.entries(defaultBaseline));
    for (const [key, val] of baselineSource.entries()) {
      if (val instanceof SimulationValue) {
        this.defaultBaseline.set(key, val);
      } else {
        const meta = registry.has(key) ? registry.get(key) : { unit: '', knowledgeStatus: 'CURRENT' };
        this.defaultBaseline.set(key, new SimulationValue({
          variable_id: key,
          value: val,
          unit: meta.unit,
          knowledge_status: meta.knowledgeStatus,
          provenance: 'CANONICAL_BASELINE'
        }));
      }
    }
    Object.freeze(this.defaultBaseline);
  }

  /**
   * Executes a simulation run under an optional scenario.
   * @param {import('./scenario.js').Scenario|Object} [scenario]
   * @param {Object} [options]
   * @param {number} [options.horizonMonths]
   * @returns {Object} Simulation run result containing ticks, trace, and summary
   */
  run(scenario = null, options = {}) {
    // 1. Validate scenario overrides if present
    if (scenario) {
      this.validator.validate(scenario);
    }

    const overrides = scenario ? (scenario.overrides || scenario) : {};

    // 2. Resolve topological execution order of rules
    const orderedRules = this.dependencyResolver.resolveOrder(this.ruleRegistry.getAll());

    // 3. Initialize trace
    const trace = new ExecutionTrace();

    // Determine horizon
    const horizonOverride = overrides.simulation_horizon_months;
    const horizonBase = this.defaultBaseline.get('simulation_horizon_months');
    const horizon = options.horizonMonths || horizonOverride || (horizonBase ? horizonBase.value : 12);

    // 4. Build tick-by-tick simulation states
    const ticks = [];

    // Helper to initialize or advance state
    let previousState = null;

    for (let t = 0; t <= horizon; t++) {
      const currentState = new Map();

      if (t === 0) {
        // t = 0: Seed with baseline values + scenario overrides
        for (const [key, baseVal] of this.defaultBaseline.entries()) {
          if (Object.prototype.hasOwnProperty.call(overrides, key)) {
            const overrideVal = overrides[key];
            const meta = this.registry.get(key);
            currentState.set(key, new SimulationValue({
              variable_id: key,
              value: overrideVal,
              unit: meta.unit,
              knowledge_status: KnowledgeStatus.SIMULATION_ASSUMPTION,
              confidence: ConfidenceRating.MEDIUM,
              provenance: 'SCENARIO_OVERRIDE',
              explanation: `Overridden by scenario '${scenario?.name || scenario?.id || 'Custom'}'`
            }));
          } else {
            // Clone baseline value to guarantee immutability
            currentState.set(key, baseVal.cloneWith());
          }
        }
      } else {
        // t >= 1: Carry over state from t - 1
        for (const [key, val] of previousState.entries()) {
          currentState.set(key, val.cloneWith());
        }

        // Apply any inter-tick feedback loops or transitions
        this._applyInterTickTransitions(currentState, previousState, t);
      }

      // Evaluate rules in topological order within tick
      for (const rule of orderedRules) {
        if (Object.prototype.hasOwnProperty.call(overrides, rule.outputVariable)) {
          // Explicit scenario override pins this variable; bypass rule evaluation
          trace.record({
            tick: t,
            ruleId: rule.id,
            outputVariable: rule.outputVariable,
            inputValues: {},
            result: currentState.get(rule.outputVariable),
            explanation: `Scenario override explicitly pins '${rule.outputVariable}' = ${currentState.get(rule.outputVariable).value}; rule '${rule.id}' bypassed.`
          });
          continue;
        }
        this._evaluateRule(rule, currentState, t, trace);
      }

      // Freeze tick state
      Object.freeze(currentState);
      ticks.push(currentState);
      previousState = currentState;
    }

    return {
      scenario: scenario ? (scenario.id || 'custom') : 'canonical_baseline',
      horizonMonths: horizon,
      ticks,
      trace,
      summary: this._generateSummary(ticks)
    };
  }

  /**
   * Applies inter-tick transitions (e.g. cash drain, customer carryover).
   */
  _applyInterTickTransitions(currentState, previousState, t) {
    // 1. Solvency carryover: cash_balance(t) = cash_balance(t-1) - monthly_burn(t-1)
    const prevCash = previousState.get('cash_balance');
    const prevBurn = previousState.get('monthly_burn');

    if (prevCash && prevBurn && !prevCash.is_unknown && !prevBurn.is_unknown) {
      const newCash = Math.max(0, Number(prevCash.value) - Number(prevBurn.value));
      currentState.set('cash_balance', prevCash.cloneWith({
        value: newCash,
        explanation: `Carried over from t=${t-1} minus burn of Rp${prevBurn.value}`,
        provenance: 'INTER_TICK_CASH_FLOW'
      }));
    } else if (prevCash && prevBurn && (prevCash.is_unknown || prevBurn.is_unknown)) {
      currentState.set('cash_balance', createUnknownValue(
        'cash_balance',
        `Inter-tick cash carryover at t=${t} is UNKNOWN because upstream ${prevCash.is_unknown ? 'prior cash_balance' : 'prior monthly_burn'} is UNKNOWN.`,
        'INTER_TICK_CASH_FLOW'
      ));
    }

    // 2. Subscriber carryover: active_customers(t) = retained(t-1) + new(t-1)
    const prevRetained = previousState.get('retained_customer_count');
    const prevNew = previousState.get('new_paid_customer_count');
    const prevPro = previousState.get('active_pro_customers');
    const prevBiz = previousState.get('active_business_customers');

    if (prevRetained && prevRetained.is_unknown) {
      currentState.set('active_pro_customers', createUnknownValue(
        'active_pro_customers',
        `Cohort carryover at t=${t} is UNKNOWN because upstream prior retained_customer_count is UNKNOWN.`,
        'COHORT_AGING_TRANSITION'
      ));
      currentState.set('active_business_customers', createUnknownValue(
        'active_business_customers',
        `Cohort carryover at t=${t} is UNKNOWN because upstream prior retained_customer_count is UNKNOWN.`,
        'COHORT_AGING_TRANSITION'
      ));
    } else if (prevRetained && !prevRetained.is_unknown) {
      // Allocate retained + new proportionally across tiers based on prior mix
      const newPaidVal = (prevNew && !prevNew.is_unknown) ? Number(prevNew.value) : 0;
      const totalPaid = Math.max(0, Number(prevRetained.value) + newPaidVal);
      const oldTotal = (prevPro?.value || 0) + (prevBiz?.value || 0);
      const proRatio = oldTotal > 0 ? (prevPro.value / oldTotal) : 0.8;
      const bizRatio = 1 - proRatio;

      currentState.set('active_pro_customers', new SimulationValue({
        variable_id: 'active_pro_customers',
        value: totalPaid * proRatio,
        unit: 'customers',
        knowledge_status: KnowledgeStatus.SIMULATION_ASSUMPTION,
        provenance: 'COHORT_AGING_TRANSITION',
        explanation: `Carried over from t=${t-1} (${totalPaid} total paid * ${(proRatio*100).toFixed(0)}% Pro)`
      }));

      currentState.set('active_business_customers', new SimulationValue({
        variable_id: 'active_business_customers',
        value: totalPaid * bizRatio,
        unit: 'customers',
        knowledge_status: KnowledgeStatus.SIMULATION_ASSUMPTION,
        provenance: 'COHORT_AGING_TRANSITION',
        explanation: `Carried over from t=${t-1} (${totalPaid} total paid * ${(bizRatio*100).toFixed(0)}% Business)`
      }));
    }
  }

  /**
   * Evaluates an individual rule within a tick.
   */
  _evaluateRule(rule, state, tick, trace) {
    const inputs = {};
    let hasUnknownInput = false;
    const unknownInputIds = [];
    let lowestConfidence = ConfidenceRating.HIGH;
    let highestHypothesis = false;
    let hasSimulationAssumption = false;

    for (const inputId of rule.inputVariables) {
      const inputVal = state.get(inputId);
      inputs[inputId] = inputVal;

      if (!inputVal || inputVal.is_unknown) {
        hasUnknownInput = true;
        unknownInputIds.push(inputId);
      } else {
        // Track confidence
        if (inputVal.confidence === ConfidenceRating.LOW) {
          lowestConfidence = ConfidenceRating.LOW;
        } else if (inputVal.confidence === ConfidenceRating.MEDIUM && lowestConfidence !== ConfidenceRating.LOW) {
          lowestConfidence = ConfidenceRating.MEDIUM;
        }

        // Track knowledge status
        if (inputVal.knowledge_status === KnowledgeStatus.HYPOTHESIS) {
          highestHypothesis = true;
        } else if (inputVal.knowledge_status === KnowledgeStatus.SIMULATION_ASSUMPTION) {
          hasSimulationAssumption = true;
        }
      }
    }

    const meta = this.registry.has(rule.outputVariable)
      ? this.registry.get(rule.outputVariable)
      : { unit: rule.unit || '', knowledgeStatus: KnowledgeStatus.SIMULATION_ASSUMPTION };

    let resultValue;

    if (hasUnknownInput) {
      // First-class UNKNOWN propagation
      resultValue = new SimulationValue({
        variable_id: rule.outputVariable,
        value: 'UNKNOWN',
        unit: meta.unit,
        knowledge_status: KnowledgeStatus.UNKNOWN,
        confidence: ConfidenceRating.UNKNOWN,
        provenance: `RULE:${rule.id}`,
        explanation: `Cannot compute ${rule.outputVariable}: mandatory input(s) [${unknownInputIds.join(', ')}] are UNKNOWN.`,
        is_unknown: true
      });
    } else {
      try {
        const rawOutput = rule.evaluate(inputs, { tick, state, registry: this.registry });

        // Determine derived knowledge status
        let derivedStatus = rule.knowledgeStatus;
        if (!derivedStatus) {
          if (highestHypothesis) {
            derivedStatus = KnowledgeStatus.HYPOTHESIS;
          } else if (hasSimulationAssumption) {
            derivedStatus = KnowledgeStatus.SIMULATION_ASSUMPTION;
          } else {
            derivedStatus = KnowledgeStatus.VERIFIED_BEHAVIOR;
          }
        }

        resultValue = new SimulationValue({
          variable_id: rule.outputVariable,
          value: rawOutput.value !== undefined ? rawOutput.value : rawOutput,
          unit: meta.unit,
          knowledge_status: derivedStatus,
          confidence: lowestConfidence,
          provenance: `RULE:${rule.id}`,
          explanation: rawOutput.explanation || rule.description
        });
      } catch (err) {
        resultValue = new SimulationValue({
          variable_id: rule.outputVariable,
          value: 'UNKNOWN',
          unit: meta.unit,
          knowledge_status: KnowledgeStatus.UNKNOWN,
          confidence: ConfidenceRating.UNKNOWN,
          provenance: `RULE_ERROR:${rule.id}`,
          explanation: `Evaluation error: ${err.message}`,
          is_unknown: true
        });
      }
    }

    state.set(rule.outputVariable, resultValue);

    trace.record({
      tick,
      ruleId: rule.id,
      outputVariable: rule.outputVariable,
      inputValues: inputs,
      result: resultValue,
      explanation: resultValue.explanation
    });
  }

  _generateSummary(ticks) {
    if (!ticks || ticks.length === 0) return {};
    const finalTick = ticks[ticks.length - 1];
    return {
      total_ticks: ticks.length - 1,
      final_total_mrr: finalTick.get('total_mrr')?.value,
      final_total_paid_customers: finalTick.get('total_paid_customers')?.value,
      final_cash_balance: finalTick.get('cash_balance')?.value,
      final_cash_runway_months: finalTick.get('cash_runway_months')?.value,
      final_gross_margin_rate: finalTick.get('gross_margin_rate')?.value
    };
  }
}
