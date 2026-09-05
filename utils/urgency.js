function calculateUrgency({ heartRate, oxygenLevel, bloodPressure }) {
  let score = 0;

  // Oxygen level
  if (oxygenLevel < 90) score += 50;
  else if (oxygenLevel < 95) score += 20;

  // Heart rate
  if (heartRate > 120 || heartRate < 50) score += 30;
  else if (heartRate > 100 || heartRate < 60) score += 10;

  // Blood pressure — expects format like "140/90"
  if (bloodPressure && bloodPressure.includes("/")) {
    const [systolic, diastolic] = bloodPressure.split("/").map(Number);
    if (systolic >= 180 || diastolic >= 120) score += 40; // hypertensive crisis
    else if (systolic >= 140 || diastolic >= 90) score += 15; // high
    else if (systolic < 90 || diastolic < 60) score += 25; // low (can be dangerous too)
  }

  return score;
}

module.exports = calculateUrgency;