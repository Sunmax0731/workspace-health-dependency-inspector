const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeItems, buildReviewModel, renderHtmlReport } = require('../src/core.cjs');

test('review model exposes status cards and next actions', () => {
  const report = analyzeItems({ items: [{
  "id": "workspace-health-dependency-inspector-missing-required",
  "title": "必須項目不足サンプル",
  "status": "ready",
  "nodeVersion": "v24.14.0",
  "gitStatus": "clean",
  "requiredFiles": [
    "README.md",
    "docs/manual-test.md"
  ]
}] });
  const model = buildReviewModel(report);
  assert.equal(model.statusLabel, '修正が必要');
  assert.ok(model.completionRate < 100);
  assert.ok(model.cards.length >= 4);
  assert.match(renderHtmlReport(report), /Next Actions/);
});
