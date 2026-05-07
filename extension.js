const vscode = require('vscode');
const { analyzeItems, renderMarkdownReport } = require('./src/core.cjs');

function activate(context) {
  const disposable = vscode.commands.registerCommand('workspace-health-dependency-inspector.openReview', () => {
    const sample = { items: [{"id":"workspace-health-1","title":"ワークスペース状態・依存・健康診断 サンプル 1","workspace":"D:\\AI\\VSCodeExtension\\workspace-health-dependency-inspector","nodeVersion":"v24.14.0","gitStatus":"clean","requiredFiles":["README.md","docs/manual-test.md"]}, {"id":"workspace-health-missing-required","title":"必須項目不足サンプル","nodeVersion":"v24.14.0","gitStatus":"clean","requiredFiles":["README.md","docs/manual-test.md"]}] };
    const report = analyzeItems(sample);
    const panel = vscode.window.createWebviewPanel('workspace-health', 'ワークスペース状態・依存・健康診断', vscode.ViewColumn.One, {});
    panel.webview.html = `<!doctype html><html lang="ja"><meta charset="utf-8"><body><pre>${escapeHtml(renderMarkdownReport(report))}</pre></body></html>`;
  });
  context.subscriptions.push(disposable);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

function deactivate() {}

module.exports = { activate, deactivate };
