import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, Scenario, KnowledgeStatus, ConfidenceRating } from '../src/index.js';

describe('Family J: Provenance & Knowledge Status Propagation', () => {
  test('baseline variables inherit CANONICAL_BASELINE provenance and canonical status', () => {
    const simulator = createSimulator();
    const result = simulator.run();
    const tick0 = result.ticks[0];

    const freePlan = tick0.get('free_plan_enabled');
    assert.equal(freePlan.provenance, 'CANONICAL_BASELINE');
    assert.equal(freePlan.knowledge_status, KnowledgeStatus.CURRENT);

    const proPrice = tick0.get('pro_price_monthly');
    assert.equal(proPrice.provenance, 'CANONICAL_BASELINE');
    assert.equal(proPrice.value, 49000);
  });

  test('scenario overrides receive SCENARIO_OVERRIDE provenance and SIMULATION_ASSUMPTION status', () => {
    const simulator = createSimulator();
    const scenario = new Scenario({
      id: 'scen-override-test',
      name: 'Override Test',
      overrides: {
        active_pro_customers: 50
      }
    });

    const result = simulator.run(scenario);
    const tick0 = result.ticks[0];

    const proCust = tick0.get('active_pro_customers');
    assert.equal(proCust.provenance, 'SCENARIO_OVERRIDE');
    assert.equal(proCust.knowledge_status, KnowledgeStatus.SIMULATION_ASSUMPTION);
  });

  test('derived rules carry RULE:<rule_id> provenance', () => {
    const simulator = createSimulator();
    const scenario = new Scenario({
      id: 'scen-derived-provenance',
      name: 'Derived Provenance Test',
      overrides: {
        active_pro_customers: 50,
        active_business_customers: 5
      }
    });

    const result = simulator.run(scenario);
    const tick0 = result.ticks[0];

    const totalCust = tick0.get('total_paid_customers');
    assert.equal(totalCust.provenance, 'RULE:RULE-REV-05');
    assert.equal(totalCust.value, 55);

    const proMrr = tick0.get('pro_mrr');
    assert.equal(proMrr.provenance, 'RULE:RULE-REV-01');
    assert.equal(proMrr.value, 50 * 49000);
  });

  test('derived output degrades to SIMULATION_ASSUMPTION when inputs include scenario overrides', () => {
    const simulator = createSimulator();
    const scenario = new Scenario({
      id: 'scen-assumption-degradation',
      name: 'Assumption Degradation Test',
      overrides: {
        active_pro_customers: 100 // Overridden -> SIMULATION_ASSUMPTION
      }
    });

    const result = simulator.run(scenario);
    const tick0 = result.ticks[0];

    const proMrr = tick0.get('pro_mrr');
    // pro_mrr = active_pro_customers * pro_price_monthly
    // active_pro_customers is SIMULATION_ASSUMPTION, pro_price_monthly is CURRENT/ACCEPTED_BASELINE
    assert.equal(proMrr.knowledge_status, KnowledgeStatus.SIMULATION_ASSUMPTION);
  });

  test('confidence propagates lowest input confidence to output', () => {
    const simulator = createSimulator();
    const scenario = new Scenario({
      id: 'scen-confidence-cascade',
      name: 'Confidence Cascade Test',
      overrides: {
        active_pro_customers: 100,
        active_business_customers: 10
      }
    });

    const result = simulator.run(scenario);
    const tick0 = result.ticks[0];

    const totalMrr = tick0.get('total_mrr');
    // Inputs: pro_mrr (MEDIUM) and business_mrr (MEDIUM)
    assert.equal(totalMrr.confidence, ConfidenceRating.MEDIUM);
  });

  test('execution trace accurately logs evaluated steps with explanations', () => {
    const simulator = createSimulator();
    const scenario = new Scenario({
      id: 'scen-trace-verification',
      name: 'Trace Verification Test',
      overrides: {
        active_pro_customers: 10,
        active_business_customers: 2
      }
    });

    const result = simulator.run(scenario);
    assert.ok(result.trace, 'Trace object must exist');
    const entries = result.trace.getAll();
    assert.ok(entries.length > 0, 'Trace must record evaluation steps');

    const revRuleStep = entries.find(s => s.ruleId === 'RULE-REV-01');
    assert.ok(revRuleStep, 'Trace must capture RULE-REV-01 evaluation');
    assert.equal(revRuleStep.outputVariable, 'pro_mrr');
    assert.equal(revRuleStep.result.value, 10 * 49000);
    assert.ok(revRuleStep.explanation.includes('Rp490000'), 'Explanation must include computed figure');

    const explanationText = result.trace.explain('pro_mrr', 0);
    assert.ok(explanationText.includes('pro_mrr'), 'Explanation must explain variable');
  });
});
