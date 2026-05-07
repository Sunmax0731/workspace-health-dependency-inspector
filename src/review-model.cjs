function buildReviewModel(report) {
  const totalChecks = Math.max(1, report.summary.totalItems * report.summary.checkedFields);
  const resolvedChecks = Math.max(0, totalChecks - report.summary.errors);
  const completionRate = Math.round((resolvedChecks / totalChecks) * 100);
  const nextActions = report.findings.length === 0
    ? ['手動テストを実施し、release-checklist に結果を反映する']
    : report.findings.slice(0, 5).map((finding) => finding.nextAction);
  const statusLabel = report.summary.errors > 0 ? '要修正' : report.summary.warnings > 0 ? '要確認' : '公開前確認へ進行可';
  return {
    statusLabel,
    completionRate,
    nextActions,
    cards: [
      { label: '対象', value: String(report.summary.totalItems) },
      { label: '不足', value: String(report.summary.errors) },
      { label: '確認', value: String(report.summary.warnings) },
      { label: '完了率', value: `${completionRate}%` }
    ]
  };
}

module.exports = { buildReviewModel };
