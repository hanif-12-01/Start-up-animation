/**
 * Executable Calculation Rules per the Simulation Rulebook.
 * Pure deterministic functions adhering to rule taxonomy and UNKNOWN propagation.
 */

export const RULES = [
  // -------------------------------------------------------------
  // REVENUE & SUBSCRIBER IDENTITIES
  // -------------------------------------------------------------
  {
    id: 'RULE-REV-05',
    outputVariable: 'total_paid_customers',
    inputVariables: ['active_pro_customers', 'active_business_customers'],
    ruleClass: 'IDENTITY',
    description: 'Total active paying subscribers across all tiers',
    evaluate: (inputs) => {
      const pro = Number(inputs.active_pro_customers.value);
      const biz = Number(inputs.active_business_customers.value);
      return {
        value: pro + biz,
        explanation: `${pro} Pro + ${biz} Business = ${pro + biz} total paid customers`
      };
    }
  },
  {
    id: 'RULE-REV-01',
    outputVariable: 'pro_mrr',
    inputVariables: ['active_pro_customers', 'pro_price_monthly'],
    ruleClass: 'IDENTITY',
    description: 'Monthly recurring subscription revenue from Pro accounts',
    evaluate: (inputs) => {
      const customers = Number(inputs.active_pro_customers.value);
      const price = Number(inputs.pro_price_monthly.value);
      const mrr = customers * price;
      return {
        value: mrr,
        explanation: `${customers} Pro customers * Rp${price} = Rp${mrr}`
      };
    }
  },
  {
    id: 'RULE-REV-02',
    outputVariable: 'business_mrr',
    inputVariables: ['active_business_customers', 'business_price_monthly'],
    ruleClass: 'IDENTITY',
    description: 'Monthly recurring subscription revenue from Business accounts',
    evaluate: (inputs) => {
      const customers = Number(inputs.active_business_customers.value);
      const price = Number(inputs.business_price_monthly.value);
      const mrr = customers * price;
      return {
        value: mrr,
        explanation: `${customers} Business customers * Rp${price} = Rp${mrr}`
      };
    }
  },
  {
    id: 'RULE-REV-03',
    outputVariable: 'total_mrr',
    inputVariables: ['pro_mrr', 'business_mrr'],
    ruleClass: 'IDENTITY',
    description: 'Total monthly recurring revenue',
    evaluate: (inputs) => {
      const pro = Number(inputs.pro_mrr.value);
      const biz = Number(inputs.business_mrr.value);
      const total = pro + biz;
      return {
        value: total,
        explanation: `Rp${pro} Pro MRR + Rp${biz} Business MRR = Rp${total}`
      };
    }
  },
  {
    id: 'RULE-REV-04',
    outputVariable: 'arr',
    inputVariables: ['total_mrr'],
    ruleClass: 'IDENTITY',
    description: 'Annual recurring revenue run-rate (total_mrr * 12)',
    evaluate: (inputs) => {
      const mrr = Number(inputs.total_mrr.value);
      const arr = mrr * 12;
      return {
        value: arr,
        explanation: `Rp${mrr} MRR * 12 months = Rp${arr} ARR`
      };
    }
  },
  {
    id: 'RULE-REV-06',
    outputVariable: 'arpa',
    inputVariables: ['total_mrr', 'total_paid_customers'],
    ruleClass: 'IDENTITY',
    description: 'Average monthly revenue per paying account',
    evaluate: (inputs) => {
      const mrr = Number(inputs.total_mrr.value);
      const paid = Number(inputs.total_paid_customers.value);
      const arpa = paid > 0 ? mrr / paid : 0.0;
      return {
        value: arpa,
        explanation: paid > 0
          ? `Rp${mrr} MRR / ${paid} customers = Rp${arpa.toFixed(2)}/account`
          : 'Zero paid customers -> Rp0.00 ARPA'
      };
    }
  },
  {
    id: 'RULE-REV-07',
    outputVariable: 'arpa_per_location',
    inputVariables: ['business_mrr', 'active_business_customers', 'average_locations_per_business_account'],
    ruleClass: 'MODEL_ASSUMPTION',
    description: 'Average revenue realized per commercial branch location managed under Business tier',
    evaluate: (inputs) => {
      const mrr = Number(inputs.business_mrr.value);
      const biz = Number(inputs.active_business_customers.value);
      const avgLoc = Number(inputs.average_locations_per_business_account.value);
      const totalLoc = biz * avgLoc;
      const arpaLoc = totalLoc > 0 ? mrr / totalLoc : 0.0;
      return {
        value: arpaLoc,
        explanation: totalLoc > 0
          ? `Rp${mrr} Business MRR / (${biz} biz * ${avgLoc} loc = ${totalLoc} locations) = Rp${arpaLoc.toFixed(2)}/location`
          : 'Zero Business locations -> Rp0.00'
      };
    }
  },

  // -------------------------------------------------------------
  // CUSTOMER GROWTH & FUNNEL (EXPECTED VALUES)
  // -------------------------------------------------------------
  {
    id: 'RULE-FUN-01',
    outputVariable: 'signup_count',
    inputVariables: ['visitor_count', 'signup_rate'],
    ruleClass: 'MODEL_ASSUMPTION',
    description: 'Expected new registered accounts from visitors',
    evaluate: (inputs) => {
      const visitors = Number(inputs.visitor_count.value);
      const rate = Number(inputs.signup_rate.value);
      const signups = visitors * rate;
      return {
        value: signups,
        explanation: `${visitors} visitors * ${(rate * 100).toFixed(1)}% signup rate = ${signups.toFixed(2)} signups`
      };
    }
  },
  {
    id: 'RULE-FUN-02',
    outputVariable: 'onboarded_user_count',
    inputVariables: ['signup_count', 'onboarding_completion_rate'],
    ruleClass: 'MODEL_ASSUMPTION',
    description: 'Expected accounts completing onboarding setup',
    evaluate: (inputs) => {
      const signups = Number(inputs.signup_count.value);
      const rate = Number(inputs.onboarding_completion_rate.value);
      const onboarded = signups * rate;
      return {
        value: onboarded,
        explanation: `${signups.toFixed(2)} signups * ${(rate * 100).toFixed(1)}% completion = ${onboarded.toFixed(2)} onboarded`
      };
    }
  },
  {
    id: 'RULE-FUN-03',
    outputVariable: 'trial_user_count',
    inputVariables: ['onboarded_user_count', 'trial_start_rate'],
    ruleClass: 'MODEL_ASSUMPTION',
    description: 'Expected accounts starting explicit Pro trial',
    evaluate: (inputs) => {
      const onboarded = Number(inputs.onboarded_user_count.value);
      const rate = Number(inputs.trial_start_rate.value);
      const trials = onboarded * rate;
      return {
        value: trials,
        explanation: `${onboarded.toFixed(2)} onboarded * ${(rate * 100).toFixed(1)}% trial start = ${trials.toFixed(2)} trials`
      };
    }
  },
  {
    id: 'RULE-FUN-04',
    outputVariable: 'new_paid_customer_count',
    inputVariables: ['trial_user_count', 'trial_to_paid_conversion_rate', 'leads', 'sales_conversion_rate'],
    ruleClass: 'IDENTITY',
    description: 'Expected newly acquired paying subscribers from trial conversions and direct sales',
    evaluate: (inputs) => {
      const trials = Number(inputs.trial_user_count.value);
      const trialRate = Number(inputs.trial_to_paid_conversion_rate.value);
      const leads = Number(inputs.leads.value);
      const salesRate = Number(inputs.sales_conversion_rate.value);

      const trialConv = trials * trialRate;
      const salesConv = leads * salesRate;
      const totalNew = trialConv + salesConv;

      return {
        value: totalNew,
        explanation: `(${trials.toFixed(2)} trials * ${(trialRate * 100).toFixed(1)}% = ${trialConv.toFixed(2)}) + (${leads} leads * ${(salesRate * 100).toFixed(1)}% = ${salesConv.toFixed(2)}) = ${totalNew.toFixed(2)} new paid customers`
      };
    }
  },

  // -------------------------------------------------------------
  // RETENTION & CHURN DYNAMICS
  // -------------------------------------------------------------
  {
    id: 'RULE-RET-01',
    outputVariable: 'churned_customer_count',
    inputVariables: ['total_paid_customers', 'monthly_account_churn_rate'],
    ruleClass: 'MODEL_ASSUMPTION',
    description: 'Expected monthly churned customer accounts',
    evaluate: (inputs) => {
      const paid = Number(inputs.total_paid_customers.value);
      const churnRate = Number(inputs.monthly_account_churn_rate.value);
      const churned = paid * churnRate;
      return {
        value: churned,
        explanation: `${paid} paid customers * ${(churnRate * 100).toFixed(2)}% churn = ${churned.toFixed(2)} churned`
      };
    }
  },
  {
    id: 'RULE-RET-02',
    outputVariable: 'retained_customer_count',
    inputVariables: ['total_paid_customers', 'churned_customer_count'],
    ruleClass: 'IDENTITY',
    description: 'Paid customers successfully retained into the next cycle',
    evaluate: (inputs) => {
      const paid = Number(inputs.total_paid_customers.value);
      const churned = Number(inputs.churned_customer_count.value);
      const retained = Math.max(0, paid - churned);
      return {
        value: retained,
        explanation: `${paid} paid - ${churned.toFixed(2)} churned = ${retained.toFixed(2)} retained customers`
      };
    }
  },

  // -------------------------------------------------------------
  // OPERATIONS & SUPPORT BURDEN
  // -------------------------------------------------------------
  {
    id: 'RULE-OPS-01',
    outputVariable: 'support_burden',
    inputVariables: [
      'total_paid_customers',
      'active_business_customers',
      'average_locations_per_business_account',
      'support_tickets_per_customer',
      'support_tickets_per_location',
      'support_capacity'
    ],
    ruleClass: 'MODEL_ASSUMPTION',
    description: 'Operational support burden ratio (total tickets / resolution capacity)',
    evaluate: (inputs) => {
      const paid = Number(inputs.total_paid_customers.value);
      const biz = Number(inputs.active_business_customers.value);
      const avgLoc = Number(inputs.average_locations_per_business_account.value);
      const ticketPerCust = Number(inputs.support_tickets_per_customer.value);
      const ticketPerLoc = Number(inputs.support_tickets_per_location.value);
      const capacity = Number(inputs.support_capacity.value);

      const baseTickets = paid * ticketPerCust;
      const extraLocations = Math.max(0, avgLoc - 1.0);
      const locTickets = biz * extraLocations * ticketPerLoc;
      const totalTickets = baseTickets + locTickets;

      const burden = capacity > 0 ? totalTickets / capacity : 0.0;

      return {
        value: burden,
        explanation: `Base: ${baseTickets.toFixed(1)} tix + Loc: ${locTickets.toFixed(1)} tix = ${totalTickets.toFixed(1)} total tix / ${capacity} cap = ${burden.toFixed(3)} burden ratio`
      };
    }
  },
  {
    id: 'RULE-OPS-02',
    outputVariable: 'customer_support_cost',
    inputVariables: [
      'total_paid_customers',
      'active_business_customers',
      'average_locations_per_business_account',
      'support_tickets_per_customer',
      'support_tickets_per_location',
      'support_cost_per_ticket'
    ],
    ruleClass: 'MODEL_ASSUMPTION',
    description: 'Monthly customer onboarding and support labor cost',
    evaluate: (inputs) => {
      const paid = Number(inputs.total_paid_customers.value);
      const biz = Number(inputs.active_business_customers.value);
      const avgLoc = Number(inputs.average_locations_per_business_account.value);
      const ticketPerCust = Number(inputs.support_tickets_per_customer.value);
      const ticketPerLoc = Number(inputs.support_tickets_per_location.value);
      const costPerTicket = Number(inputs.support_cost_per_ticket.value);

      const baseTickets = paid * ticketPerCust;
      const extraLocations = Math.max(0, avgLoc - 1.0);
      const locTickets = biz * extraLocations * ticketPerLoc;
      const totalTickets = baseTickets + locTickets;
      const totalCost = totalTickets * costPerTicket;

      return {
        value: totalCost,
        explanation: `${totalTickets.toFixed(1)} tickets * Rp${costPerTicket}/ticket = Rp${totalCost.toFixed(0)}`
      };
    }
  },

  // -------------------------------------------------------------
  // COSTS, MARGINS & SOLVENCY
  // -------------------------------------------------------------
  {
    id: 'RULE-CST-01',
    outputVariable: 'cogs',
    inputVariables: [
      'hosting_cost',
      'database_cost',
      'inference_cost',
      'payment_gateway_cost',
      'customer_support_cost'
    ],
    ruleClass: 'IDENTITY',
    description: 'Total Cost of Goods Sold (hosting + database + inference + gateway + support)',
    evaluate: (inputs) => {
      const hosting = Number(inputs.hosting_cost.value);
      const db = Number(inputs.database_cost.value);
      const inf = Number(inputs.inference_cost.value);
      const gw = Number(inputs.payment_gateway_cost.value);
      const supp = Number(inputs.customer_support_cost.value);
      const totalCogs = hosting + db + inf + gw + supp;

      return {
        value: totalCogs,
        explanation: `Hosting(Rp${hosting}) + DB(Rp${db}) + Inference(Rp${inf}) + Gateway(Rp${gw}) + Support(Rp${supp.toFixed(0)}) = Rp${totalCogs.toFixed(0)} COGS`
      };
    }
  },
  {
    id: 'RULE-CST-02',
    outputVariable: 'gross_profit',
    inputVariables: ['total_mrr', 'cogs'],
    ruleClass: 'IDENTITY',
    description: 'Startup gross profit (total_mrr - cogs)',
    evaluate: (inputs) => {
      const mrr = Number(inputs.total_mrr.value);
      const cogs = Number(inputs.cogs.value);
      const gp = mrr - cogs;
      return {
        value: gp,
        explanation: `Rp${mrr} MRR - Rp${cogs.toFixed(0)} COGS = Rp${gp.toFixed(0)} Gross Profit`
      };
    }
  },
  {
    id: 'RULE-CST-03',
    outputVariable: 'gross_margin_rate',
    inputVariables: ['gross_profit', 'total_mrr'],
    ruleClass: 'IDENTITY',
    description: 'Startup gross margin percentage (gross_profit / total_mrr)',
    evaluate: (inputs) => {
      const gp = Number(inputs.gross_profit.value);
      const mrr = Number(inputs.total_mrr.value);
      const margin = mrr > 0 ? gp / mrr : 0.0;
      return {
        value: margin,
        explanation: mrr > 0
          ? `Rp${gp.toFixed(0)} GP / Rp${mrr} MRR = ${(margin * 100).toFixed(2)}% Gross Margin`
          : 'Zero MRR -> 0.0% Gross Margin'
      };
    }
  },
  {
    id: 'RULE-CST-04',
    outputVariable: 'monthly_burn',
    inputVariables: ['cogs', 'marketing_spend', 'total_mrr'],
    ruleClass: 'IDENTITY',
    description: 'Net monthly cash burn ((cogs + marketing_spend) - total_mrr)',
    evaluate: (inputs) => {
      const cogs = Number(inputs.cogs.value);
      const mkt = Number(inputs.marketing_spend.value);
      const mrr = Number(inputs.total_mrr.value);
      const opex = cogs + mkt;
      const burn = opex - mrr;
      return {
        value: burn,
        explanation: `OpEx Rp${opex.toFixed(0)} (COGS Rp${cogs.toFixed(0)} + Mkt Rp${mkt}) - MRR Rp${mrr} = Net Burn Rp${burn.toFixed(0)}/mo`
      };
    }
  },
  {
    id: 'RULE-CST-05',
    outputVariable: 'cash_runway_months',
    inputVariables: ['cash_balance', 'monthly_burn'],
    ruleClass: 'IDENTITY',
    description: 'Estimated operational runway duration (cash_balance / monthly_burn)',
    evaluate: (inputs) => {
      const cash = Number(inputs.cash_balance.value);
      const burn = Number(inputs.monthly_burn.value);

      if (burn <= 0) {
        return {
          value: Infinity,
          explanation: `Burn is Rp${burn.toFixed(0)}/mo <= 0 (Net Cash Positive / Sustainable Runway)`
        };
      }

      const runway = cash / burn;
      return {
        value: runway,
        explanation: `Rp${cash.toFixed(0)} cash / Rp${burn.toFixed(0)} burn = ${runway.toFixed(1)} months runway`
      };
    }
  },
  {
    id: 'RULE-CST-06',
    outputVariable: 'cac',
    inputVariables: ['marketing_spend', 'new_paid_customer_count'],
    ruleClass: 'IDENTITY',
    description: 'Customer Acquisition Cost (marketing_spend / new_paid_customer_count)',
    evaluate: (inputs) => {
      const mkt = Number(inputs.marketing_spend.value);
      const newPaid = Number(inputs.new_paid_customer_count.value);
      const cac = newPaid > 0 ? mkt / newPaid : 0.0;
      return {
        value: cac,
        explanation: newPaid > 0
          ? `Rp${mkt} marketing / ${newPaid.toFixed(2)} new customers = Rp${cac.toFixed(0)} CAC`
          : 'Zero acquired customers -> Rp0.00 CAC'
      };
    }
  }
];

export default RULES;
