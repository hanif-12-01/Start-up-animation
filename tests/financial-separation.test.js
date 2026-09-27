import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { createSimulator, Scenario } from '../src/index.js';

describe('Family I: Financial Separation Tests', () => {
  test('total_mrr contains strictly pro_mrr and business_mrr without customer electricity metrics', () => {
    const simulator = createSimulator();

    // In a scenario where customers are specified:
    const activeScenario = new Scenario({
      id: 'active-customers',
      name: 'Active Customers Test',
      overrides: {
        active_pro_customers: 200,
        active_business_customers: 20
      }
    });

    const result = simulator.run(activeScenario);
    const tick0 = result.ticks[0];
    const proMrr = tick0.get('pro_mrr').value;
    const bizMrr = tick0.get('business_mrr').value;
    const totalMrr = tick0.get('total_mrr').value;

    assert.equal(typeof totalMrr, 'number');
    assert.equal(totalMrr, proMrr + bizMrr, 'total_mrr must equal pro_mrr + business_mrr');
  });

  test('overriding revenue_after_electricity has ZERO effect on startup financial metrics', () => {
    const simulator = createSimulator();

    const baseScenario = new Scenario({
      id: 'base-venture-state',
      name: 'Base Venture State',
      overrides: {
        active_pro_customers: 100,
        active_business_customers: 10,
        marketing_spend: 5000000,
        cash_balance: 50000000
      }
    });

    // Baseline run
    const baselineResult = simulator.run(baseScenario);
    const baselineMrr = baselineResult.ticks[0].get('total_mrr').value;
    const baselineArr = baselineResult.ticks[0].get('arr').value;
    const baselineBurn = baselineResult.ticks[0].get('monthly_burn').value;

    // Custom scenario providing a large value for revenue_after_electricity (e.g. 50,000,000 IDR)
    const customScenario = new Scenario({
      id: 'customer-revenue-override',
      name: 'Customer Electricity Metrics Override',
      overrides: {
        active_pro_customers: 100,
        active_business_customers: 10,
        marketing_spend: 5000000,
        cash_balance: 50000000,
        revenue_after_electricity: 50000000.0
      }
    });

    const scenarioResult = simulator.run(customScenario);
    const scenTick = scenarioResult.ticks[0];

    // Assert revenue_after_electricity took the overridden value
    assert.equal(scenTick.get('revenue_after_electricity').value, 50000000.0);

    // Assert startup financial metrics are COMPLETELY unchanged
    assert.equal(scenTick.get('total_mrr').value, baselineMrr, 'total_mrr must not be altered');
    assert.equal(scenTick.get('arr').value, baselineArr, 'arr must not be altered');
    assert.equal(scenTick.get('monthly_burn').value, baselineBurn, 'monthly_burn must not be altered');
  });

  test('revenue_after_electricity metadata declares client-facing micro-business context', () => {
    const simulator = createSimulator();
    const meta = simulator.registry.get('revenue_after_electricity');

    assert.ok(meta, 'revenue_after_electricity metadata must exist');
    assert.match(meta.notes, /CRITICAL ACCOUNTING DISTINCTION/i, 'Notes must emphasize critical accounting distinction');
    assert.match(meta.notes, /Sisa Kas Bersih.*retired/i, 'Must note that Sisa Kas Bersih is permanently retired');
    assert.match(meta.description, /commercial MSMEs/i, 'Description must specify commercial MSMEs');
  });

  test('no rule outputs to total_mrr that takes revenue_after_electricity as input', () => {
    const simulator = createSimulator();
    const mrrRules = simulator.ruleRegistry.getRulesForOutput('total_mrr');

    assert.ok(mrrRules.length > 0, 'Rule for total_mrr must exist');
    for (const rule of mrrRules) {
      assert.ok(!rule.inputVariables.includes('revenue_after_electricity'), 'Rule inputs must not include customer revenue metric');
    }
  });
});
