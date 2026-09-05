// Safe medical ranges — anything outside these gets flagged as critical
const safeRanges = {
  hemoglobin: { min: 12, max: 17 },   // g/dL
  bloodSugar: { min: 70, max: 140 },   // mg/dL
  wbc: { min: 4, max: 11 },            // x10^9/L
};

function checkCriticalValues(values) {
  const criticalFlags = [];

  for (const key in values) {
    const value = values[key];
    const range = safeRanges[key];
    if (range && value !== undefined && (value < range.min || value > range.max)) {
      criticalFlags.push({
        test: key,
        value,
        safeRange: `${range.min} - ${range.max}`,
        severity: value < range.min * 0.7 || value > range.max * 1.5 ? "severe" : "moderate",
      });
    }
  }

  return criticalFlags;
}

module.exports = checkCriticalValues;