# SKILL

## Start Order

1. docs/competitive-benchmark.md で競合と公式基準を確認します。
2. docs/evaluation-criteria.md でQCDS評価範囲を確認します。
3. docs/requirements.md、docs/specification.md、docs/design.md で要件、仕様、責務を確認します。
4. 実装後に `npm test` を実行し、docs/qcds-evaluation.md を再生成します。
5. 手動確認が必要な範囲は docs/manual-test.md と docs/user-guide.md に具体手順として残します。

## Lessons

- 文字化けした生成物は正式ドキュメントとして扱わず、利用者が読める日本語で再作成します。
- QCDSは実装スコアではなく、導入、利用、保守、リリース判断まで含めたプロダクトスコアとして扱います。
- 競合の強みをそのまま追うのではなく、この製品の狭い利用場面で判断が速くなるかを差別化軸にします。

## Strict QCDS Lessons

- ファイルが存在するだけでは合格にしない。代表シナリオを実行し、期待結果とmetricsを残す。
- QCDSのS判定には、ユーザーdocs、リリースdocs、Security/Privacy、Traceabilityを含める。
- 再実行後に docs/qcds-strict-metrics.json が安定して再生成されることを確認する。
