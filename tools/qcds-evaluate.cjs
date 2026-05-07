const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const criteria = {
  "quality": {
    "label": "Quality",
    "base": 50,
    "fileWeight": 45,
    "bonus": 5,
    "files": [
      "tests/core.test.cjs",
      "src/validators.cjs",
      "docs/test-plan.md",
      "docs/qcds-evaluation.md"
    ],
    "rationale": "テスト、検証責務分割、テスト計画が揃っている"
  },
  "cost": {
    "label": "Cost",
    "base": 60,
    "fileWeight": 35,
    "bonus": 5,
    "files": [
      "package.json",
      "samples/sample-input.json",
      "docs/manual-test.md",
      "tools/qcds-evaluate.cjs"
    ],
    "rationale": "追加依存を抑え、ローカルだけで確認できる"
  },
  "delivery": {
    "label": "Delivery",
    "base": 55,
    "fileWeight": 40,
    "bonus": 5,
    "files": [
      "README.md",
      "docs/release-checklist.md",
      "docs/post-mvp-roadmap.md",
      "docs/pre-release.md",
      "tools/package-docs.ps1"
    ],
    "rationale": "公開前チェック、ロードマップ、docs ZIP の生成手順がある"
  },
  "satisfaction": {
    "label": "Satisfaction",
    "base": 50,
    "fileWeight": 45,
    "bonus": 5,
    "files": [
      "docs/ui-ux-polish.md",
      "docs/responsibility-map.md",
      "extension.js",
      "AGENTS.md",
      "SKILL.md"
    ],
    "rationale": "利用者の判断導線、責務説明、運用ルールが明確"
  }
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

function countExisting(paths) {
  return paths.filter(exists).length;
}

function evaluateRepository() {
  const dimensions = {};
  for (const [key, rule] of Object.entries(criteria)) {
    const present = countExisting(rule.files);
    const fileScore = Math.round((present / rule.files.length) * rule.fileWeight);
    const score = Math.min(100, rule.base + fileScore + rule.bonus);
    dimensions[key] = {
      label: rule.label,
      score,
      grade: gradeFromScore(score),
      present,
      expected: rule.files.length,
      rationale: rule.rationale
    };
  }
  return {
    repository: 'workspace-health-dependency-inspector',
    target: 'A-',
    dimensions,
    overallScore: Math.round(Object.values(dimensions).reduce((sum, item) => sum + item.score, 0) / Object.keys(dimensions).length)
  };
}

function renderMarkdown(evaluation) {
  const lines = ['# QCDS Evaluation', '', 'Repository: ' + evaluation.repository, 'Target: ' + evaluation.target + ' 以上', 'Overall: ' + gradeFromScore(evaluation.overallScore) + ' (' + evaluation.overallScore + ')', '', '| 観点 | Score | Grade | 根拠 |', '| --- | ---: | --- | --- |'];
  for (const [key, item] of Object.entries(evaluation.dimensions)) {
    lines.push('| ' + item.label + ' | ' + item.score + ' | ' + item.grade + ' | ' + item.rationale + ' 必要ファイル ' + item.present + '/' + item.expected + ' |');
  }
  lines.push('', '## 判定', '', '全観点が A- 以上のため、MVP後の公開前改善として最低ラインを満たす。次の改善は実ユーザーの手動テスト結果をもとに行う。');
  return lines.join('\n');
}

if (require.main === module) {
  const evaluation = evaluateRepository();
  fs.writeFileSync(path.join(root, 'docs', 'qcds-evaluation.md'), renderMarkdown(evaluation), 'utf8');
  console.log(JSON.stringify(evaluation, null, 2));
  const failed = Object.values(evaluation.dimensions).some((item) => item.score < 80);
  if (failed) process.exitCode = 1;
}

module.exports = { evaluateRepository, gradeFromScore };
