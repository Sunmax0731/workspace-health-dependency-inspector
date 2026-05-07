# 厳格QCDSギャップ分析

## 採用した厳格基準

movie-telop-transcriber の代表サンプル、正解データ、metrics JSON運用と、codex-remote-android のID付き要件、Release前Security確認、Issueトレーサビリティを基準にした。

## 改善前に不足しやすかった点

- 評価がファイル存在確認に寄り、代表シナリオの実行結果を十分に見ていなかった。
- 機械可読なQCDS metricsと回帰ベースラインが分離されていなかった。
- Security/Privacy、リリース前の秘密情報確認、トレーサビリティの文書が不足していた。

## 改善後の状態

- 代表シナリオを追加した。
- 自動テストで代表シナリオの期待結果を検証する。
- tools/qcds-evaluate.cjs が厳格QCDSを再評価し、metrics JSONを生成する。
- Security/Privacy、Traceability、Remote Benchmark docsを追加した。
