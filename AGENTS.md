# AGENTS

このリポジトリは ワークスペース健全性・依存関係インスペクター のMVP後改善版です。作業前に README.md、SKILL.md、docs/competitive-benchmark.md、docs/evaluation-criteria.md、docs/manual-test.md を確認してください。

## 作業ルール

- 作業ブランチは `codex/<task-summary>` を1本だけ使い、工程完了ごとに `main` へmergeします。
- 評価は実装だけでなく、README、導入手順、ユーザーガイド、手動テスト、開発ドキュメント、リリース前資料まで含めます。
- 競合比較は VS Code Extension API、GitHub Desktop、PowerToys Run を参照し、公式標準と差別化を docs/competitive-benchmark.md に残します。
- 新しいツールを追加する場合は C ドライブではなく `E:\DevEnv` 以下を使います。
- 文字化け、手戻り、検証不足を見つけた場合は SKILL.md に短い再発防止策を追記します。

## 現在の評価ゲート

- QCDS各観点は最低 A-、完成判断は S-/S+ を目標にします。
- `npm test` は自動テストに加えて `tools/qcds-evaluate.cjs` を実行します。

## Remote QCDS Benchmark Rules

- 厳格評価では、ほかのリモートリポジトリで運用されているQCDS証跡を先に確認する。
- 代表シナリオ、機械可読metrics、回帰ベースライン、Security/Privacy、Traceabilityを満たさない場合はS評価にしない。
- movie-telop-transcriber と codex-remote-android を比較基準にする。
