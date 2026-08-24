// Very simple text parser — looks for common lab report patterns like "Hemoglobin: 11.5"
function parseLabText(text) {
  const values = {};

  const hemoglobinMatch = text.match(/hemoglobin[:\s]+(\d+\.?\d*)/i);
  if (hemoglobinMatch) values.hemoglobin = parseFloat(hemoglobinMatch[1]);

  const sugarMatch = text.match(/(blood\s*sugar|glucose)[:\s]+(\d+\.?\d*)/i);
  if (sugarMatch) values.bloodSugar = parseFloat(sugarMatch[2]);

  const wbcMatch = text.match(/wbc[:\s]+(\d+\.?\d*)/i);
  if (wbcMatch) values.wbc = parseFloat(wbcMatch[1]);

  return values;
}

module.exports = parseLabText;