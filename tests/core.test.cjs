const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeItems, renderMarkdownReport } = require('../src/core.cjs');

test('valid sample passes required field checks', () => {
  const report = analyzeItems({ items: [{
  "id": "workspace-health-1",
  "title": "ワークスペース状態・依存・健康診断 サンプル 1",
  "workspace": "D:\\AI\\VSCodeExtension\\workspace-health-dependency-inspector",
  "nodeVersion": "v24.14.0",
  "gitStatus": "clean",
  "requiredFiles": [
    "README.md",
    "docs/manual-test.md"
  ]
}] });
  assert.equal(report.summary.result, 'passed');
  assert.equal(report.summary.errors, 0);
});

test('missing required field is reported', () => {
  const report = analyzeItems({ items: [{
  "id": "workspace-health-missing-required",
  "title": "必須項目不足サンプル",
  "nodeVersion": "v24.14.0",
  "gitStatus": "clean",
  "requiredFiles": [
    "README.md",
    "docs/manual-test.md"
  ]
}] });
  assert.equal(report.summary.result, 'failed');
  assert.equal(report.summary.errors, 1);
  assert.match(renderMarkdownReport(report), /未設定/);
});
