# workspace-health-dependency-inspector

ワークスペース健全性・依存関係インスペクター は、VS CodeワークスペースのNode、Git状態、必須ファイル、依存関係を確認する。

## 対象ユーザー

- VS Codeで複数リポジトリを扱う開発者

## 主な価値

- 必須項目の不足を自動検出します。
- 手動テスト、導入手順、リリース前確認を同じドキュメント体系で確認できます。
- 競合プロダクトと公式標準を基準に、QCDSを実装とドキュメントの両方で評価します。

## 使い方

```powershell
cd D:\AI\VSCodeExtension\workspace-health-dependency-inspector
npm test
code --extensionDevelopmentPath="D:\AI\VSCodeExtension\workspace-health-dependency-inspector"
```

## ドキュメント

- docs/requirements.md
- docs/specification.md
- docs/design.md
- docs/implementation-plan.md
- docs/test-plan.md
- docs/manual-test.md
- docs/installation-guide.md
- docs/user-guide.md
- docs/competitive-benchmark.md
- docs/evaluation-criteria.md
- docs/release-checklist.md
- docs/post-mvp-roadmap.md
- docs/qcds-evaluation.md
