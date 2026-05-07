const productConfig = {
  "repo": "workspace-health-dependency-inspector",
  "titleJa": "ワークスペース状態・依存・健康診断",
  "summary": "VS Codeワークスペースの依存と健康診断",
  "requiredFields": [
    "workspace",
    "nodeVersion",
    "gitStatus",
    "requiredFiles"
  ],
  "qcdsTarget": "A-"
};

module.exports = { productConfig };
