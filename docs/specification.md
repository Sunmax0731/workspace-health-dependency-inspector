# 仕様

## 入力

- JSON形式。
- ルートは配列、単一オブジェクト、または `items` 配列を持つオブジェクトに対応する。
- 必須項目: `workspace`, `nodeVersion`, `gitStatus`, `requiredFiles`。

## 処理

1. 入力を正規化する。
2. 必須項目の空値、未定義、空配列を検出する。
3. `status` に失敗、保留、blocked、error を示す値が含まれる場合は warning とする。
4. 集計結果と findings を生成する。

## 出力

- `report.json`: 機械処理向けの検証結果。
- `report.md`: 手動レビュー向けの検証結果。

## MVP外

- 外部サービスへの自動投稿。
- 認証情報の保存。
- 破壊的なファイル変更。
