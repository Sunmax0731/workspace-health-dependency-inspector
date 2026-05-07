const productConfig = {
  "repo": "workspace-health-dependency-inspector",
  "titleJa": "ワークスペース健全性・依存関係インスペクター",
  "summary": "VS CodeワークスペースのNode、Git状態、必須ファイル、依存関係を確認する。",
  "requiredFields": [
    "workspace",
    "nodeVersion",
    "gitStatus",
    "requiredFiles"
  ],
  "qcdsTarget": "A-"
};

module.exports = { productConfig };
