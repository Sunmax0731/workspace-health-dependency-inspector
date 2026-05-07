const { isPresent } = require('./input.cjs');

function validateRequiredFields(items, requiredFields, titleJa) {
  const findings = [];
  for (const [index, item] of items.entries()) {
    for (const field of requiredFields) {
      if (!isPresent(item[field])) {
        findings.push({
          level: 'error',
          itemId: item.id || item.title || `item-${index + 1}`,
          field,
          message: `${field} が未設定です`,
          nextAction: `${titleJa} の手動確認前に ${field} を入力してください`
        });
      }
    }
  }
  return findings;
}

function validateStatus(items) {
  const findings = [];
  for (const [index, item] of items.entries()) {
    if (isPresent(item.status) && /fail|blocked|error|失敗|保留/i.test(String(item.status))) {
      findings.push({
        level: 'warning',
        itemId: item.id || item.title || `item-${index + 1}`,
        field: 'status',
        message: '状態に失敗または保留を示す値が含まれています',
        nextAction: 'ログと手動テスト手順を確認してください'
      });
    }
  }
  return findings;
}

module.exports = { validateRequiredFields, validateStatus };
