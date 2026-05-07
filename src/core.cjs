const { productConfig } = require('./config.cjs');
const { normalizeInput } = require('./input.cjs');
const { validateRequiredFields, validateStatus } = require('./validators.cjs');
const { buildReviewModel } = require('./review-model.cjs');
const { renderMarkdownReport, renderHtmlReport } = require('./report.cjs');

function analyzeItems(source, options = {}) {
  const items = normalizeInput(source);
  const requiredFields = options.requiredFields || productConfig.requiredFields;
  const findings = [
    ...validateRequiredFields(items, requiredFields, productConfig.titleJa),
    ...validateStatus(items)
  ];
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

module.exports = { productConfig, normalizeInput, analyzeItems, buildReviewModel, renderMarkdownReport, renderHtmlReport };
