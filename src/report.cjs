const { buildReviewModel } = require('./review-model.cjs');

function renderMarkdownReport(report) {
  const model = buildReviewModel(report);
  const lines = [
    `# ${report.product.titleJa} チェックレポート`,
    '',
    `- Repository: ${report.product.repo}`,
    `- Result: ${report.summary.result}`,
    `- Status: ${model.statusLabel}`,
    `- Completion: ${model.completionRate}%`,
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
  lines.push('', '## Next Actions', '');
  for (const action of model.nextActions) lines.push(`- ${action}`);
  lines.push('', '## Manual Test Reference', '', '- docs/manual-test.md を確認してください。');
  return lines.join('\n');
}

function renderHtmlReport(report) {
  const model = buildReviewModel(report);
  const findings = report.findings.length === 0
    ? '<p class="empty">指摘はありません。</p>'
    : `<ul>${report.findings.map((finding) => `<li><strong>${escapeHtml(finding.level)}</strong> ${escapeHtml(finding.itemId)} / ${escapeHtml(finding.field)}<br><span>${escapeHtml(finding.message)}</span><br><em>${escapeHtml(finding.nextAction)}</em></li>`).join('')}</ul>`;
  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(report.product.titleJa)} レポート</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; color: #162022; background: #f5f7f7; }
    main { max-width: 980px; margin: 0 auto; padding: 24px; display: grid; gap: 18px; }
    h1 { margin: 0; font-size: 24px; }
    .status { display: inline-flex; width: fit-content; padding: 5px 10px; border: 1px solid #8ab5a4; background: #e7f2ed; color: #153b31; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
    .card { background: white; border: 1px solid #d8dfdf; padding: 12px; }
    .card span { display: block; color: #667; font-size: 12px; }
    .card strong { display: block; margin-top: 6px; font-size: 20px; }
    section { background: white; border: 1px solid #d8dfdf; padding: 16px; }
  </style>
</head>
<body>
<main>
  <header>
    <h1>${escapeHtml(report.product.titleJa)}</h1>
    <div class="status">${escapeHtml(model.statusLabel)}</div>
  </header>
  <div class="cards">${model.cards.map((card) => `<div class="card"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong></div>`).join('')}</div>
  <section><h2>Findings</h2>${findings}</section>
  <section><h2>Next Actions</h2><ul>${model.nextActions.map((action) => `<li>${escapeHtml(action)}</li>`).join('')}</ul></section>
</main>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

module.exports = { renderMarkdownReport, renderHtmlReport };
