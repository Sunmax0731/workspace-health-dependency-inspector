const vscode = require('vscode');
const { analyzeItems, buildReviewModel, renderHtmlReport } = require('./src/core.cjs');

function activate(context) {
  const disposable = vscode.commands.registerCommand('workspace-health-dependency-inspector.openReview', () => {
    const sample = { items: [{"id":"workspace-health-dependency-inspector-1","title":"ワークスペース状態・依存・健康診断 サンプル 1","status":"ready","workspace":"D:\\AI\\VSCodeExtension\\workspace-health-dependency-inspector","nodeVersion":"v24.14.0","gitStatus":"clean","requiredFiles":["README.md","docs/manual-test.md"]}, {"id":"workspace-health-dependency-inspector-missing-required","title":"必須項目不足サンプル","status":"ready","nodeVersion":"v24.14.0","gitStatus":"clean","requiredFiles":["README.md","docs/manual-test.md"]}] };
    const report = analyzeItems(sample);
    const model = buildReviewModel(report);
    const panel = vscode.window.createWebviewPanel('workspace-health-dependency-inspector', 'ワークスペース状態・依存・健康診断', vscode.ViewColumn.One, { enableScripts: false });
    panel.webview.html = renderHtmlReport(report);
    vscode.window.setStatusBarMessage('ワークスペース状態・依存・健康診断: ' + model.statusLabel, 5000);
  });
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
