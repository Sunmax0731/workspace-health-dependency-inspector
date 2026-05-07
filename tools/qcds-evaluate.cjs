const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const product = {
  "repository": "workspace-health-dependency-inspector",
  "target": "A-",
  "dimensions": {
    "quality": [
      {
        "id": "automated-tests",
        "description": "自動テストまたは構造検証がある",
        "files": [
          "tests/core.test.cjs",
          "tests/review-model.test.cjs"
        ]
      },
      {
        "id": "implementation-responsibility",
        "description": "実装責務が分割されている",
        "files": [
          "src/core.cjs",
          "src/validators.cjs",
          "src/report.cjs",
          "src/review-model.cjs",
          "extension.js",
          "package.json"
        ]
      },
      {
        "id": "test-plan",
        "description": "テスト計画がある",
        "files": [
          "docs/test-plan.md"
        ]
      },
      {
        "id": "text-clean",
        "description": "追跡対象の実装とドキュメントに文字化けがない",
        "special": "noMojibake"
      }
    ],
    "cost": [
      {
        "id": "lean-package",
        "description": "依存関係を抑えている",
        "special": "leanPackage"
      },
      {
        "id": "install-guide",
        "description": "導入手順書がある",
        "files": [
          "docs/installation-guide.md"
        ]
      },
      {
        "id": "sample-input",
        "description": "サンプル入力またはサンプルチェックリストがある",
        "files": [
          "samples/sample-input.json"
        ]
      },
      {
        "id": "docs-packaging",
        "description": "ドキュメントZIP化手順がある",
        "files": [
          "tools/package-docs.ps1"
        ]
      }
    ],
    "delivery": [
      {
        "id": "readme-links",
        "description": "READMEが主要ドキュメントへ誘導している",
        "special": "readmeLinks"
      },
      {
        "id": "release-checklist",
        "description": "リリースチェックリストがある",
        "files": [
          "docs/release-checklist.md"
        ]
      },
      {
        "id": "pre-release",
        "description": "リリース前確認がある",
        "files": [
          "docs/pre-release.md"
        ]
      },
      {
        "id": "post-mvp-roadmap",
        "description": "MVP後ロードマップがある",
        "files": [
          "docs/post-mvp-roadmap.md"
        ]
      },
      {
        "id": "qcds-tool",
        "description": "QCDS評価ツールがある",
        "files": [
          "tools/qcds-evaluate.cjs"
        ]
      }
    ],
    "satisfaction": [
      {
        "id": "user-guide",
        "description": "ユーザーガイドがある",
        "files": [
          "docs/user-guide.md"
        ]
      },
      {
        "id": "manual-test",
        "description": "手動テスト手順がある",
        "files": [
          "docs/manual-test.md"
        ]
      },
      {
        "id": "ui-ux-polish",
        "description": "UI/UXブラッシュアップ方針がある",
        "files": [
          "docs/ui-ux-polish.md"
        ]
      },
      {
        "id": "responsibility-map",
        "description": "責務マップがある",
        "files": [
          "docs/responsibility-map.md"
        ]
      },
      {
        "id": "competitive-benchmark",
        "description": "競合比較と差別化がある",
        "files": [
          "docs/competitive-benchmark.md",
          "docs/evaluation-criteria.md"
        ]
      }
    ]
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

function fileExists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function allFilesExist(files) {
  const missing = files.filter((file) => !fileExists(file));
  return { pass: missing.length === 0, detail: missing.length ? 'missing: ' + missing.join(', ') : 'ok' };
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function trackedTextFiles() {
  let files = [];
  try {
    files = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
  } catch {
    files = [];
  }
  const textExt = new Set(['.md', '.mjs', '.cjs', '.js', '.json', '.html', '.cs', '.ps1']);
  return files.filter((file) => {
    if (file.startsWith('docs/idea-source/')) return false;
    if (file.startsWith('dist/')) return false;
    if (file.includes('/node_modules/')) return false;
    return textExt.has(path.extname(file).toLowerCase());
  });
}

function hasMojibake(text) {
  const markers = new Set([0x7e67, 0x7e5d, 0x7e3a, 0x8703, 0x9aeb, 0x90e2, 0x8b41, 0x9695, 0x8373]);
  for (const char of text) {
    if (markers.has(char.codePointAt(0))) return true;
  }
  return false;
}

function noMojibake() {
  const offenders = [];
  for (const file of trackedTextFiles()) {
    const absolute = path.join(root, file);
    if (!fs.existsSync(absolute)) continue;
    if (hasMojibake(fs.readFileSync(absolute, 'utf8'))) offenders.push(file);
  }
  return { pass: offenders.length === 0, detail: offenders.length ? offenders.slice(0, 8).join(', ') : 'ok' };
}

function leanPackage() {
  const pkg = JSON.parse(readText('package.json'));
  const runtimeDeps = Object.keys(pkg.dependencies || {});
  return { pass: runtimeDeps.length === 0, detail: runtimeDeps.length ? 'runtime dependencies: ' + runtimeDeps.join(', ') : 'no runtime dependencies' };
}

function readmeLinks() {
  const readme = readText('README.md');
  const required = ['docs/installation-guide.md', 'docs/user-guide.md', 'docs/competitive-benchmark.md', 'docs/evaluation-criteria.md', 'docs/manual-test.md'];
  const missing = required.filter((item) => !readme.includes(item));
  return { pass: missing.length === 0, detail: missing.length ? 'missing links: ' + missing.join(', ') : 'ok' };
}

function runCheck(check) {
  if (check.files) return allFilesExist(check.files);
  if (check.special === 'noMojibake') return noMojibake();
  if (check.special === 'leanPackage') return leanPackage();
  if (check.special === 'readmeLinks') return readmeLinks();
  return { pass: false, detail: 'unknown check' };
}

function evaluateRepository() {
  const dimensions = {};
  for (const [key, checks] of Object.entries(product.dimensions)) {
    const results = checks.map((check) => ({ ...check, ...runCheck(check) }));
    const passed = results.filter((item) => item.pass).length;
    const score = Math.round(60 + (passed / results.length) * 40);
    dimensions[key] = {
      label: key[0].toUpperCase() + key.slice(1),
      score,
      grade: gradeFromScore(score),
      passed,
      expected: results.length,
      checks: results
    };
  }
  const overallScore = Math.round(Object.values(dimensions).reduce((sum, item) => sum + item.score, 0) / Object.keys(dimensions).length);
  return {
    repository: product.repository,
    target: product.target,
    dimensions,
    overallScore,
    overallGrade: gradeFromScore(overallScore)
  };
}

function renderMarkdown(evaluation) {
  const lines = [
    '# QCDS Evaluation',
    '',
    'Repository: ' + evaluation.repository,
    'Target: ' + evaluation.target + ' 以上',
    'Overall: ' + evaluation.overallGrade + ' (' + evaluation.overallScore + ')',
    '',
    '| 観点 | Score | Grade | Passed |',
    '| --- | ---: | --- | ---: |'
  ];
  for (const item of Object.values(evaluation.dimensions)) {
    lines.push('| ' + item.label + ' | ' + item.score + ' | ' + item.grade + ' | ' + item.passed + '/' + item.expected + ' |');
  }
  lines.push('', '## 詳細', '');
  for (const [key, item] of Object.entries(evaluation.dimensions)) {
    lines.push('### ' + item.label, '');
    for (const check of item.checks) {
      lines.push('- ' + (check.pass ? '[x] ' : '[ ] ') + check.description + ' - ' + check.detail);
    }
    lines.push('');
  }
  lines.push('## 判定', '', '実装、開発ドキュメント、ユーザー向け導入資料、手動テスト手順、競合差別化を含めて評価しました。全観点がA-以上の場合のみ合格です。');
  return lines.join('\n');
}

function main() {
  const evaluation = evaluateRepository();
  fs.writeFileSync(path.join(root, 'docs', 'qcds-evaluation.md'), renderMarkdown(evaluation), 'utf8');
  console.log(JSON.stringify(evaluation, null, 2));
  const failed = Object.values(evaluation.dimensions).some((item) => item.score < 80);
  if (failed) process.exitCode = 1;
}

if (require.main === module) main();

module.exports = { evaluateRepository, gradeFromScore };
