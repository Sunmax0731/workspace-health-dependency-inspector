# 責務マップ

| 領域 | 責務 | ファイル |
| --- | --- | --- |
| 入力正規化 | 入力を配列として扱える形にする | src/input.cjs |
| 検証 | 必須項目と状態を判定する | src/validators.cjs |
| 表示モデル | ステータス、カード、次アクションを組み立てる | src/review-model.cjs |
| レポート/UI | 利用者に結果を表示する | src/core.cjs、src/validators.cjs、src/report.cjs、src/review-model.cjs、extension.js、package.json |
| 評価 | QCDSと文字化けを検証する | tools/qcds-evaluate.cjs |
