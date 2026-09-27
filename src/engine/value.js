/**
 * SimulationValue Envelope — Immutable wrapper preserving value, units, knowledge status, and provenance.
 */

export const KnowledgeStatus = Object.freeze({
  CURRENT: 'CURRENT',
  ACCEPTED_BASELINE: 'ACCEPTED_BASELINE',
  VERIFIED_BEHAVIOR: 'VERIFIED_BEHAVIOR',
  SOURCE_BACKED_TARGET: 'SOURCE_BACKED_TARGET',
  SIMULATION_ASSUMPTION: 'SIMULATION_ASSUMPTION',
  HYPOTHESIS: 'HYPOTHESIS',
  UNKNOWN: 'UNKNOWN',
  TARGET: 'TARGET',
  IMPLEMENTATION_GAP: 'IMPLEMENTATION_GAP',
  ACCEPTED_CANONICAL_METRIC: 'ACCEPTED_CANONICAL_METRIC'
});

export const ConfidenceRating = Object.freeze({
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  UNKNOWN: 'UNKNOWN'
});

export class SimulationValue {
  /**
   * @param {Object} options
   * @param {number|string|boolean|null|'UNKNOWN'} options.value
   * @param {string} options.variable_id
   * @param {string} [options.unit]
   * @param {string} [options.knowledge_status]
   * @param {string} [options.confidence]
   * @param {string} [options.provenance]
   * @param {string} [options.explanation]
   * @param {boolean} [options.is_unknown]
   */
  constructor({
    value,
    variable_id,
    unit = '',
    knowledge_status = KnowledgeStatus.CURRENT,
    confidence = ConfidenceRating.HIGH,
    provenance = 'CANONICAL_BASELINE',
    explanation = '',
    is_unknown = false
  }) {
    if (!variable_id) {
      throw new Error('SimulationValue requires a variable_id.');
    }

    const determinedUnknown = is_unknown || value === 'UNKNOWN' || value === undefined || value === null;

    this.variable_id = variable_id;
    this.value = determinedUnknown ? 'UNKNOWN' : value;
    this.unit = unit;
    this.knowledge_status = determinedUnknown ? KnowledgeStatus.UNKNOWN : knowledge_status;
    this.confidence = determinedUnknown ? ConfidenceRating.UNKNOWN : confidence;
    this.provenance = provenance;
    this.explanation = explanation;
    this.is_unknown = determinedUnknown;

    Object.freeze(this);
  }

  isUnknown() {
    return this.is_unknown;
  }

  getValue() {
    return this.value;
  }

  /**
   * Derives a new SimulationValue with overrides, preserving immutability.
   */
  cloneWith(overrides = {}) {
    return new SimulationValue({
      variable_id: this.variable_id,
      value: overrides.value !== undefined ? overrides.value : this.value,
      unit: overrides.unit !== undefined ? overrides.unit : this.unit,
      knowledge_status: overrides.knowledge_status !== undefined ? overrides.knowledge_status : this.knowledge_status,
      confidence: overrides.confidence !== undefined ? overrides.confidence : this.confidence,
      provenance: overrides.provenance !== undefined ? overrides.provenance : this.provenance,
      explanation: overrides.explanation !== undefined ? overrides.explanation : this.explanation,
      is_unknown: overrides.is_unknown !== undefined ? overrides.is_unknown : this.is_unknown
    });
  }

  toObject() {
    return {
      variable_id: this.variable_id,
      value: this.value,
      unit: this.unit,
      knowledge_status: this.knowledge_status,
      confidence: this.confidence,
      provenance: this.provenance,
      explanation: this.explanation,
      is_unknown: this.is_unknown
    };
  }
}

/**
 * Creates an UNKNOWN SimulationValue envelope with a specific reason.
 */
export function createUnknownValue(variable_id, unit = '', explanation = 'Value is an empirical unknown.', provenance = 'EMPIRICAL_GAP') {
  return new SimulationValue({
    variable_id,
    value: 'UNKNOWN',
    unit,
    knowledge_status: KnowledgeStatus.UNKNOWN,
    confidence: ConfidenceRating.UNKNOWN,
    provenance,
    explanation,
    is_unknown: true
  });
}
