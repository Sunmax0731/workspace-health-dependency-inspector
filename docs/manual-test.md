# 手動テスト

## 準備

- リポジトリ: `D:\AI\VSCodeExtension\workspace-health-dependency-inspector`
- `npm test` が成功していること
- VS Codeが必要です
- 起動コマンド: `code --extensionDevelopmentPath="D:\AI\VSCodeExtension\workspace-health-dependency-inspector"`
- ローカルサーバーは不要です

## 手順

1. PowerShellで `code --extensionDevelopmentPath="D:\AI\VSCodeExtension\workspace-health-dependency-inspector"` を実行する
2. Extension Development Hostでコマンドパレットを開く
3. `ワークスペース健全性・依存関係インスペクター: レビューを開く` を実行する
4. WebviewにステータスカードとFindingsが表示されることを確認する
5. Status Barに状態が一時表示されることを確認する

## 期待結果

- 必須項目不足が分かる形で表示される。
- 次アクションがユーザーに理解できる。
- 実行ログ、出力ファイル、または画面表示をリリース前確認に使える。

## 厳格QCDS補足

- 追加の確認観点は docs/strict-manual-test-addendum.md を参照してください。
