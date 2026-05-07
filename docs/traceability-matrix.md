# トレーサビリティマトリクス

| ID | 要件 | 実装 | 自動テスト | ユーザーdocs | リリースdocs |
| --- | --- | --- | --- | --- | --- |
| QFR-001 | 必須項目不足を検出する | src/core.cjs<br>src/validators.cjs<br>src/report.cjs<br>src/review-model.cjs<br>extension.js | tests/core.test.cjs<br>tests/review-model.test.cjs<br>tests/representative-suite.test.cjs | docs/user-guide.md | docs/release-checklist.md |
| QFR-002 | 代表シナリオを継続検証する | samples/representative-suite.json | tests/representative-suite.test.cjs | docs/manual-test.md | docs/qcds-evaluation.md |
| CFR-001 | ローカルで低コストに検証する | package.json | npm test | docs/installation-guide.md | tools/package-docs.ps1 |
| DFR-001 | リリース前判断の証跡を残す | docs/qcds-strict-metrics.json | tools/qcds-evaluate.cjs | README.md | docs/pre-release.md |
| SFR-001 | 秘密情報と外部実行リスクを抑える | docs/security-privacy-checklist.md | tools/qcds-evaluate.cjs | docs/user-guide.md | docs/release-checklist.md |
