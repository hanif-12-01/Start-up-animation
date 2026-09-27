import fs from 'node:fs';
import path from 'node:path';

const dictPath = path.resolve('docs/simulator/Variable_Dictionary.md');
const content = fs.readFileSync(dictPath, 'utf8');

const chunks = content.split('#### `').slice(1);
console.log(`Found ${chunks.length} variable definitions in Variable_Dictionary.md`);

const variables = [];
const baseline = {};

for (const chunk of chunks) {
  const id = chunk.split('`')[0].trim();

  const getField = (name) => {
    const match = chunk.match(new RegExp(`- \\*\\*${name}:\\*\\* ([^\\r\\n]+)`));
    return match ? match[1].trim() : '';
  };

  const name = getField('Display Name');
  const domain = getField('Domain').replace(/`/g, '');
  const description = getField('Description');
  const role = getField('Role').replace(/`/g, '');
  const dataType = getField('Data Type').replace(/`/g, '');
  const unit = getField('Unit');
  const knowledgeStatus = getField('Knowledge Status').replace(/`/g, '');
  const rawBaseline = getField('Baseline Value');
  const allowedValues = getField('Allowed / Scenario Values');
  const minimum = getField('Minimum');
  const maximum = getField('Maximum');
  const confidence = getField('Confidence');
  const editable = getField('Editable by User') === 'YES';
  const implementationStatus = getField('Implementation Status').replace(/`/g, '');
  const notes = getField('Notes');

  // Parse baseline value
  let parsedBaseline = 'UNKNOWN';
  if (rawBaseline.startsWith('`true`')) parsedBaseline = true;
  else if (rawBaseline.startsWith('`false`')) parsedBaseline = false;
  else if (rawBaseline.startsWith('`') && !rawBaseline.includes('UNKNOWN')) {
    const m = rawBaseline.match(/`([^`]+)`/);
    if (m) {
      const v = m[1];
      if (!isNaN(v) && v !== '') {
        parsedBaseline = Number(v);
      } else {
        parsedBaseline = v;
      }
    }
  }

  // Parse min/max
  const numMin = minimum && !isNaN(minimum.replace(/`/g, '')) ? Number(minimum.replace(/`/g, '')) : null;
  const numMax = maximum && !isNaN(maximum.replace(/`/g, '')) ? Number(maximum.replace(/`/g, '')) : null;

  // Parse allowed values for enum
  let parsedAllowed = null;
  if (allowedValues.includes('[') && allowedValues.includes(']')) {
    const listMatch = allowedValues.match(/\[(.*?)\]/);
    if (listMatch) {
      parsedAllowed = listMatch[1]
        .split(',')
        .map(s => s.trim().replace(/`/g, ''))
        .filter(Boolean)
        .map(s => {
          if (s === 'true') return true;
          if (s === 'false') return false;
          if (!isNaN(s) && s !== '') return Number(s);
          return s;
        });
    }
  }

  variables.push({
    id,
    name,
    domain,
    description,
    role,
    dataType,
    unit,
    knowledgeStatus,
    baselineValue: parsedBaseline,
    allowedValues: parsedAllowed,
    minimum: numMin,
    maximum: numMax,
    confidence,
    editable,
    implementationStatus,
    notes
  });

  baseline[id] = parsedBaseline;
}

const varsContent = `/**
 * Canonical 67-Variable Catalog generated from Variable_Dictionary.md
 */

export const VARIABLES = Object.freeze(${JSON.stringify(variables, null, 2)});

export default VARIABLES;
`;

const baselineContent = `/**
 * Canonical Baseline State generated from Variable_Dictionary.md
 * ADR-002 through ADR-008 baselines are locked; empirical unknowns are UNKNOWN.
 */

export const CANONICAL_BASELINE = Object.freeze(${JSON.stringify(baseline, null, 2)});

export default CANONICAL_BASELINE;
`;

fs.mkdirSync(path.resolve('src/model'), { recursive: true });
fs.writeFileSync(path.resolve('src/model/variables.js'), varsContent, 'utf8');
fs.writeFileSync(path.resolve('src/model/baseline.js'), baselineContent, 'utf8');

console.log(`Successfully generated src/model/variables.js and src/model/baseline.js (${variables.length} variables).`);
