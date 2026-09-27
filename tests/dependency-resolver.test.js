import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DependencyResolver, CycleError } from '../src/index.js';

describe('Family H: Dependency Resolution & Cycle Detection', () => {
  it('should topologically order rules such that upstreams precede downstreams', () => {
    const resolver = new DependencyResolver();

    const rules = [
      {
        id: 'R3_TOTAL_MRR',
        outputVariable: 'total_mrr',
        inputVariables: ['pro_mrr', 'business_mrr']
      },
      {
        id: 'R4_ARR',
        outputVariable: 'arr',
        inputVariables: ['total_mrr']
      },
      {
        id: 'R1_PRO_MRR',
        outputVariable: 'pro_mrr',
        inputVariables: ['active_pro_customers', 'pro_price_monthly']
      },
      {
        id: 'R2_BIZ_MRR',
        outputVariable: 'business_mrr',
        inputVariables: ['active_business_customers', 'business_price_monthly']
      }
    ];

    const ordered = resolver.resolveOrder(rules);
    const orderedIds = ordered.map(r => r.id);

    // R1 and R2 must execute before R3
    assert.ok(orderedIds.indexOf('R1_PRO_MRR') < orderedIds.indexOf('R3_TOTAL_MRR'));
    assert.ok(orderedIds.indexOf('R2_BIZ_MRR') < orderedIds.indexOf('R3_TOTAL_MRR'));
    // R3 must execute before R4
    assert.ok(orderedIds.indexOf('R3_TOTAL_MRR') < orderedIds.indexOf('R4_ARR'));
  });

  it('should detect a circular dependency and throw CycleError with the cyclic path', () => {
    const resolver = new DependencyResolver();

    const cyclicRules = [
      {
        id: 'RULE_A',
        outputVariable: 'var_a',
        inputVariables: ['var_b']
      },
      {
        id: 'RULE_B',
        outputVariable: 'var_b',
        inputVariables: ['var_c']
      },
      {
        id: 'RULE_C',
        outputVariable: 'var_c',
        inputVariables: ['var_a'] // creates cycle A -> B -> C -> A
      }
    ];

    assert.throws(
      () => resolver.resolveOrder(cyclicRules),
      (err) => {
        assert.ok(err instanceof CycleError);
        assert.equal(err.code, 'CYCLE_ERROR');
        assert.ok(err.message.includes('circular dependency detected'));
        return true;
      }
    );
  });
});
