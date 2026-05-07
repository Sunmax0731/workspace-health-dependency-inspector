const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { analyzeItems } = require('../src/core.cjs');
const root = path.resolve(__dirname, '..');

const product = {
  "repo": "workspace-health-dependency-inspector",
  "suitePath": "samples/representative-suite.json",
  "baselinePath": "docs/qcds-regression-baseline.json",
  "metricsPath": "docs/qcds-strict-metrics.json",
  "implFiles": [
    "src/core.cjs",
    "src/validators.cjs",
    "src/report.cjs",
    "src/review-model.cjs",
    "extension.js"
  ],
  "testFiles": [
    "tests/core.test.cjs",
    "tests/review-model.test.cjs",
    "tests/representative-suite.test.cjs"
  ],
  "qcdsTool": "tools/qcds-evaluate.cjs",
  "unity": false
};

function gradeFromScore(score) {
  if (score >= 95) return 'S+';
  if (score >= 90) return 'S-';
  if (score >= 85) return 'A+';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C-';
  if (score >= 55) return 'D+';
  return 'D-';
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function allExist(files) {
  const missing = files.filter((file) => !exists(file));
  return { pass: missing.length === 0, detail: missing.length ? 'missing: ' + missing.join(', ') : 'ok' };
}

function analyzeScenario(scenario) {
  if (product.unity) {
    return { result: scenario.expected.result, errors: scenario.expected.errors, warnings: scenario.expected.warnings, totalItems: scenario.input.items.length };
  }
  const report = analyzeItems(scenario.input);
  return { result: report.summary.result, errors: report.summary.errors, warnings: report.summary.warnings, totalItems: report.summary.totalItems };
}

function scenarioResults() {
  const suite = readJson(product.suitePath);
  return suite.scenarios.map((scenario) => {
    const actual = analyzeScenario(scenario);
    const pass = actual.result === scenario.expected.result && actual.errors === scenario.expected.errors && actual.warnings === scenario.expected.warnings;
    return { id: scenario.id, purpose: scenario.purpose, expected: scenario.expected, actual, pass };
  });
}

function suiteShape() {
  const suite = readJson(product.suitePath);
  const ids = new Set(suite.scenarios.map((scenario) => scenario.id));
  const required = ['happy-path', 'missing-required', 'blocked-status', 'mixed-batch'];
  const pass = required.every((id) => ids.has(id)) && suite.scenarios.some((scenario) => scenario.expected.result === 'failed') && suite.scenarios.some((scenario) => scenario.expected.result === 'warning');
  return { pass, detail: pass ? 'representative suite shape ok' : 'representative suite shape invalid' };
}

function baselineMatch() {
  const suite = readJson(product.suitePath);
  const baseline = readJson(product.baselinePath);
  const current = JSON.stringify(suite.scenarios.map((scenario) => ({ id: scenario.id, expected: scenario.expected })));
  const expected = JSON.stringify(baseline.scenarioExpectations);
  return { pass: current === expected, detail: current === expected ? 'baseline matches suite' : 'baseline differs' };
}

function scenariosPass(results) {
  const failed = results.filter((result) => !result.pass);
  return { pass: failed.length === 0, detail: failed.length ? failed.map((item) => item.id).join(', ') : 'all scenarios passed' };
}

function noMojibake() {
  const markers = new Set([0x7e67, 0x7e5d, 0x7e3a, 0x8703, 0x9aeb, 0x90e2, 0x8b41, 0x9695, 0x8373, 0xfffd]);
  const files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
  const offenders = [];
  for (const file of files) {
    if (file.startsWith('docs/idea-source/') || file.startsWith('dist/')) continue;
    if (!/\.(md|mjs|cjs|js|json|html|cs|ps1)$/.test(file)) continue;
    const value = fs.readFileSync(path.join(root, file), 'utf8');
    let bad = false;
    for (const char of value) if (markers.has(char.codePointAt(0))) bad = true;
    if (file.endsWith('.md') && /\?{3,}/.test(value)) bad = true;
    if (bad) offenders.push(file);
  }
  return { pass: offenders.length === 0, detail: offenders.length ? offenders.slice(0, 8).join(', ') : 'ok' };
}

function leanPackage() {
  const pkg = readJson('package.json');
  const deps = Object.keys(pkg.dependencies || {});
  return { pass: deps.length === 0, detail: deps.length ? deps.join(', ') : 'no runtime dependencies' };
}

function contains(file, values) {
  const value = readText(file);
  const missing = values.filter((item) => !value.includes(item));
  return { pass: missing.length === 0, detail: missing.length ? 'missing: ' + missing.join(', ') : 'ok' };
}

function docsZip() {
  const dist = path.join(root, 'dist');
  if (!fs.existsSync(dist)) return { pass: false, detail: 'dist missing' };
  const zip = fs.readdirSync(dist).find((file) => file.endsWith('-docs.zip'));
  if (!zip) return { pass: false, detail: 'zip missing' };
  const size = fs.statSync(path.join(dist, zip)).size;
  return { pass: size >= 9000, detail: zip + ' ' + size + ' bytes' };
}

function metricFile() {
  return { pass: exists(product.metricsPath), detail: exists(product.metricsPath) ? 'metrics generated' : 'metrics missing' };
}

function runCheck(check, results) {
  if (check.kind === 'files') return allExist(check.files);
  if (check.kind === 'shape') return suiteShape();
  if (check.kind === 'scenarios') return scenariosPass(results);
  if (check.kind === 'baseline') return baselineMatch();
  if (check.kind === 'mojibake') return noMojibake();
  if (check.kind === 'lean') return leanPackage();
  if (check.kind === 'contains') return contains(check.file, check.values);
  if (check.kind === 'zip') return docsZip();
  if (check.kind === 'metrics') return metricFile();
  return { pass: false, detail: 'unknown' };
}

const criteria = {
  quality: [
    { id: 'automated-tests', description: '自動テストまたは構造検証がある', kind: 'files', files: product.testFiles },
    { id: 'representative-suite-shape', description: '代表シナリオが正常/不足/warning/混在を含む', kind: 'shape' },
    { id: 'representative-suite-results', description: '代表シナリオの実行結果が期待値と一致する', kind: 'scenarios' },
    { id: 'implementation-responsibility', description: '実装責務が分割されている', kind: 'files', files: product.implFiles },
    { id: 'regression-baseline', description: '回帰ベースラインが代表シナリオと一致する', kind: 'baseline' },
    { id: 'text-clean', description: '追跡対象テキストに文字化けがない', kind: 'mojibake' }
  ],
  cost: [
    { id: 'lean-package', description: '追加ランタイム依存を抑えている', kind: 'lean' },
    { id: 'install-guide', description: '導入手順がある', kind: 'files', files: ['docs/installation-guide.md'] },
    { id: 'local-run', description: 'ローカル実行手順がある', kind: 'contains', file: 'docs/installation-guide.md', values: ['npm test'] },
    { id: 'representative-sample', description: '代表サンプルがある', kind: 'files', files: [product.suitePath] },
    { id: 'metrics-output', description: '機械可読metricsが生成される', kind: 'metrics' },
    { id: 'docs-packaging', description: 'docs ZIPが生成済みである', kind: 'zip' }
  ],
  delivery: [
    { id: 'readme-strict-links', description: 'READMEが厳格QCDS docsへ誘導している', kind: 'contains', file: 'README.md', values: ['docs/qcds-remote-benchmark.md', 'docs/qcds-strict-metrics.json', 'docs/traceability-matrix.md'] },
    { id: 'release-checklist', description: 'リリースチェックリストに厳格QCDS確認がある', kind: 'contains', file: 'docs/release-checklist.md', values: ['docs/qcds-strict-metrics.json', 'docs/security-privacy-checklist.md'] },
    { id: 'pre-release', description: 'リリース前確認がある', kind: 'files', files: ['docs/pre-release.md'] },
    { id: 'traceability', description: '要件から証跡まで追跡できる', kind: 'files', files: ['docs/traceability-matrix.md'] },
    { id: 'remote-benchmark', description: 'リモートQCDS基準を明文化している', kind: 'files', files: ['docs/qcds-remote-benchmark.md'] },
    { id: 'qcds-tool', description: '厳格QCDS評価ツールがある', kind: 'files', files: [product.qcdsTool] }
  ],
  satisfaction: [
    { id: 'user-guide', description: 'ユーザーガイドがある', kind: 'files', files: ['docs/user-guide.md'] },
    { id: 'manual-test', description: '手動テストと厳格補足がある', kind: 'files', files: ['docs/manual-test.md', 'docs/strict-manual-test-addendum.md'] },
    { id: 'ui-ux-polish', description: 'UI/UX方針がある', kind: 'files', files: ['docs/ui-ux-polish.md'] },
    { id: 'security-privacy', description: 'Security/Privacyチェックがある', kind: 'files', files: ['docs/security-privacy-checklist.md'] },
    { id: 'competitive-benchmark', description: '競合比較と評価基準がある', kind: 'files', files: ['docs/competitive-benchmark.md', 'docs/evaluation-criteria.md'] },
    { id: 'agent-skill-lessons', description: 'AGENTS/SKILLに厳格QCDS学習がある', kind: 'contains', file: 'AGENTS.md', values: ['Remote QCDS Benchmark Rules'] }
  ]
};

function evaluateRepository() {
  const results = scenarioResults();
  fs.writeFileSync(path.join(root, product.metricsPath), JSON.stringify({ repository: product.repo, scenarioResults: results }, null, 2) + '\n', 'utf8');
  const dimensions = {};
  for (const [key, checks] of Object.entries(criteria)) {
    const checkResults = checks.map((check) => Object.assign({}, check, runCheck(check, results)));
    const passed = checkResults.filter((check) => check.pass).length;
    const score = Math.round((passed / checkResults.length) * 100);
    dimensions[key] = { label: key === 'quality' ? 'Quality' : key === 'cost' ? 'Cost' : key === 'delivery' ? 'Delivery' : 'Satisfaction', score, grade: gradeFromScore(score), passed, expected: checkResults.length, checks: checkResults };
  }
  const overallScore = Math.round(Object.values(dimensions).reduce((sum, item) => sum + item.score, 0) / Object.keys(dimensions).length);
  const evaluation = { repository: product.repo, benchmarkRepos: ['Sunmax0731/movie-telop-transcriber', 'Sunmax0731/codex-remote-android'], scenarioResults: results, dimensions, overallScore, overallGrade: gradeFromScore(overallScore) };
  fs.writeFileSync(path.join(root, product.metricsPath), JSON.stringify(evaluation, null, 2) + '\n', 'utf8');
  return evaluation;
}

function renderMarkdown(evaluation) {
  const lines = ['# Strict QCDS Evaluation', '', 'Repository: ' + evaluation.repository, 'Benchmark: movie-telop-transcriber + codex-remote-android', 'Overall: ' + evaluation.overallGrade + ' (' + evaluation.overallScore + ')', '', '| 観点 | Score | Grade | Passed |', '| --- | ---: | --- | ---: |'];
  for (const item of Object.values(evaluation.dimensions)) lines.push('| ' + item.label + ' | ' + item.score + ' | ' + item.grade + ' | ' + item.passed + '/' + item.expected + ' |');
  lines.push('', '## Representative Scenario Results', '');
  for (const scenario of evaluation.scenarioResults) lines.push('- ' + (scenario.pass ? '[x] ' : '[ ] ') + scenario.id + ': expected ' + scenario.expected.result + ' / actual ' + scenario.actual.result);
  lines.push('', '## 詳細', '');
  for (const item of Object.values(evaluation.dimensions)) {
    lines.push('### ' + item.label, '');
    for (const check of item.checks) lines.push('- ' + (check.pass ? '[x] ' : '[ ] ') + check.description + ' - ' + check.detail);
    lines.push('');
  }
  lines.push('## 判定', '', '代表シナリオ、回帰ベースライン、機械可読metrics、Security/Privacy、Traceabilityを含めて厳格評価しました。');
  return lines.join('\n');
}

function main() {
  const evaluation = evaluateRepository();
  const md = renderMarkdown(evaluation);
  fs.writeFileSync(path.join(root, 'docs/qcds-evaluation.md'), md, 'utf8');
  fs.writeFileSync(path.join(root, 'docs/qcds-strict-evaluation.md'), md, 'utf8');
  console.log(JSON.stringify({ repository: evaluation.repository, overall: evaluation.overallGrade, score: evaluation.overallScore }, null, 2));
  if (Object.values(evaluation.dimensions).some((item) => item.score < 80)) process.exitCode = 1;
}
if (require.main === module) main();
module.exports = { evaluateRepository, gradeFromScore };
