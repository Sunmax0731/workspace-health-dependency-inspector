const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { analyzeItems } = require('../src/core.cjs');

const suite = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'samples/representative-suite.json'), 'utf8'));

test('representative QCDS suite matches expected outcomes', () => {
  assert.ok(suite.scenarios.length >= 4);
  for (const scenario of suite.scenarios) {
    const report = analyzeItems(scenario.input);
    assert.equal(report.summary.result, scenario.expected.result, scenario.id);
    assert.equal(report.summary.errors, scenario.expected.errors, scenario.id);
    assert.equal(report.summary.warnings, scenario.expected.warnings, scenario.id);
  }
});
