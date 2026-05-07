# 仕様

## 入力

必須項目: `workspace`、`nodeVersion`、`gitStatus`、`requiredFiles`

## 出力

- 検証結果のサマリー。
- 不足項目、警告、次アクション。
- 手動テストとリリース前確認への参照。

## エラー処理

- 必須項目が空、未定義、空配列の場合はerrorとして扱う。
- status に `fail`、`blocked`、`error`、`失敗`、`保留` が含まれる場合はwarningとして扱う。
- 外部サービスへの書き込みは行わず、判断材料だけを提示する。
