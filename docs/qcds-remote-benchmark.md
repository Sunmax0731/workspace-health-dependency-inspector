# リモートQCDSベンチマーク

## 探索結果

19プロダクト以外のリモートリポジトリを確認し、QCDSを明示的に使っているものとして次を採用した。

- Sunmax0731/movie-telop-transcriber: 代表データ、ground truth、actual run、metrics JSON、再実行コマンドを持つQCDS評価。
- Sunmax0731/codex-remote-android: QCDS強化計画、Issueトレーサビリティ、Release前Security確認、利用者導線を持つ評価。

## 19プロダクトへの適用

- 代表シナリオを4件以上持つ。
- 正常、必須不足、warning、混在バッチを自動テストで検証する。
- docs/qcds-strict-metrics.json に機械可読メトリクスを残す。
- docs/qcds-regression-baseline.json と現在結果を比較する。
- docs/traceability-matrix.md で要件、実装、テスト、ユーザーdocs、リリースdocsを紐づける。
- docs/security-privacy-checklist.md で秘密情報、外部実行、ログ、権限を確認する。
