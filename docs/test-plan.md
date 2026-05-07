# テスト計画

## 自動テスト

```powershell
cd D:\AI\VSCodeExtension\workspace-health-dependency-inspector
npm test
```

確認内容:

- 正常サンプルが `passed` になる。
- 必須項目不足が `failed` になる。
- レビューカード、次アクション、HTMLレポートが生成される。
- QCDS評価がA-以上である。
- 追跡対象の実装・ドキュメントに文字化けが残っていない。

## 手動テスト

docs/manual-test.md の手順を実施する。
