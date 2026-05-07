const productConfig = {
  "repo": "workspace-health-dependency-inspector",
  "titleJa": "ワークスペース状態・依存・健康診断",
  "summary": "VS Codeワークスペースの依存、Git状態、必要ファイルを確認し、健康診断レポートを表示する。",
  "profile": "workspace-health",
  "requiredFields": [
    "workspace",
    "nodeVersion",
    "gitStatus",
    "requiredFiles"
  ]
};

function isPresent(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function normalizeInput(source) {
  if (Array.isArray(source)) return source;
  if (source && Array.isArray(source.items)) return source.items;
  if (source && typeof source === 'object') return [source];
  return [];
}

function analyzeItems(source, options = {}) {
  const items = normalizeInput(source);
  const requiredFields = options.requiredFields || productConfig.requiredFields;
  const findings = [];
  for (const [index, item] of items.entries()) {
    for (const field of requiredFields) {
      if (!isPresent(item[field])) {
        findings.push({
          level: 'error',
          itemId: item.id || item.title || `item-${index + 1}`,
          field,
          message: `${field} が未設定です`,
          nextAction: `${productConfig.titleJa} の手動テスト前に ${field} を入力してください`
        });
      }
    }
    if (isPresent(item.status) && /fail|blocked|error|失敗|保留/i.test(String(item.status))) {
      findings.push({
        level: 'warning',
        itemId: item.id || item.title || `item-${index + 1}`,
        field: 'status',
        message: '状態に失敗または保留が含まれています',
        nextAction: 'ログと手動テスト手順を確認してください'
      });
    }
  }
  const errorCount = findings.filter((finding) => finding.level === 'error').length;
  const warningCount = findings.filter((finding) => finding.level === 'warning').length;
  return {
    product: productConfig,
    summary: {
      totalItems: items.length,
      checkedFields: requiredFields.length,
      errors: errorCount,
      warnings: warningCount,
      result: errorCount > 0 ? 'failed' : warningCount > 0 ? 'warning' : 'passed'
    },
    findings
  };
}

function renderMarkdownReport(report) {
  const lines = [
    `# ${report.product.titleJa} チェックレポート`,
    '',
    `- Repository: ${report.product.repo}`,
    `- Result: ${report.summary.result}`,
    `- Items: ${report.summary.totalItems}`,
    `- Errors: ${report.summary.errors}`,
    `- Warnings: ${report.summary.warnings}`,
    '',
    '## Findings',
    ''
  ];
  if (report.findings.length === 0) {
    lines.push('- 指摘はありません。');
  } else {
    for (const finding of report.findings) {
      lines.push(`- [${finding.level}] ${finding.itemId} / ${finding.field}: ${finding.message}。Next: ${finding.nextAction}`);
    }
  }
  lines.push('', '## Manual Test Reference', '', '- docs/manual-test.md を確認してください。');
  return lines.join('\n');
}

module.exports = { productConfig, normalizeInput, analyzeItems, renderMarkdownReport };
