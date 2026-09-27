/**
 * Dependency Resolver — Performs topological sorting and cycle detection on calculation rules.
 */

import { CycleError } from './errors.js';

export class DependencyResolver {
  /**
   * Resolves the execution order of calculation rules.
   * @param {Array<Object>} rules - List of executable rule objects
   * @returns {Array<Object>} Topologically ordered rules
   */
  resolveOrder(rules) {
    if (!rules || rules.length === 0) {
      return [];
    }

    // Map each output variable to the rule producing it
    const outputToRule = new Map();
    for (const rule of rules) {
      if (!rule.outputVariable) {
        throw new Error(`Rule '${rule.id}' missing outputVariable definition.`);
      }
      outputToRule.set(rule.outputVariable, rule);
    }

    // Build directed graph of rules: ruleA -> ruleB means ruleB depends on ruleA's output
    const adjList = new Map();
    for (const rule of rules) {
      adjList.set(rule.id, []);
    }

    for (const rule of rules) {
      const inputs = rule.inputVariables || [];
      for (const inputVar of inputs) {
        if (outputToRule.has(inputVar)) {
          const upstreamRule = outputToRule.get(inputVar);
          if (upstreamRule.id !== rule.id) {
            // upstreamRule must execute before rule
            adjList.get(upstreamRule.id).push(rule.id);
          } else {
            // Self-loop!
            throw new CycleError([rule.outputVariable, rule.outputVariable]);
          }
        }
      }
    }

    // Topological sort with cycle detection using DFS (White = 0, Gray = 1, Black = 2)
    const state = new Map(); // 0: unvisited, 1: visiting, 2: visited
    const parent = new Map();
    const orderedRuleIds = [];

    for (const rule of rules) {
      state.set(rule.id, 0);
    }

    const dfs = (ruleId, currentPath = []) => {
      state.set(ruleId, 1);
      const nextRules = adjList.get(ruleId) || [];

      for (const nextId of nextRules) {
        const nextState = state.get(nextId);
        if (nextState === 1) {
          // Cycle detected! Reconstruct cycle path
          const cyclePath = [...currentPath, ruleId, nextId];
          const cycleVarPath = cyclePath.map(rId => {
            const r = rules.find(x => x.id === rId);
            return r ? r.outputVariable : rId;
          });
          throw new CycleError(cycleVarPath);
        }
        if (nextState === 0) {
          parent.set(nextId, ruleId);
          dfs(nextId, [...currentPath, ruleId]);
        }
      }

      state.set(ruleId, 2);
      orderedRuleIds.push(ruleId);
    };

    for (const rule of rules) {
      if (state.get(rule.id) === 0) {
        dfs(rule.id, []);
      }
    }

    // orderedRuleIds is post-order (reversed topological order)
    orderedRuleIds.reverse();

    const ruleMap = new Map(rules.map(r => [r.id, r]));
    return orderedRuleIds.map(id => ruleMap.get(id));
  }
}
