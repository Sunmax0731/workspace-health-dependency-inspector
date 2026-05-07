# SKILL

## Start Order

1. `docs/requirements.md` で MVP 境界を確認する。
2. `docs/specification.md` で入力、処理、出力を確認する。
3. `docs/design.md` で画面または操作面の意図を確認する。
4. 実装後に `npm test` または記載された構造検証を実行する。
5. 手動確認が必要な箇所は `docs/manual-test.md` に具体的な手順として残す。

## Lessons

- 参照元 ZIP に文字化けがある場合は、その本文を採用せず、ピックアップ一覧とドメインガイドから正式docsを再作成する。
- このMVPでは、破壊的操作や外部API実行は行わず、dry-run とレポート作成に閉じる。

## Product Polish Lessons

- コア検査、レビュー導線、表示は分ける。単一の `core` に全責務を残さない。
- UIは結果本文だけでなく、状態、完了率、次アクションを表示する。
- QCDS評価は改善後に再生成し、`A-` 未満の観点があれば同じブランチで直す。
