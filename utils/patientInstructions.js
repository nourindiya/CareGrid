// Plain-language advisory notes based on which value was flagged and whether it's high or low
function generatePatientInstructions(criticalFlags) {
  const instructions = [];

  criticalFlags.forEach((flag) => {
    const isHigh = flag.value > parseFloat(flag.safeRange.split(" - ")[1]);
    const isLow = flag.value < parseFloat(flag.safeRange.split(" - ")[0]);

    if (flag.test === "hemoglobin") {
      if (isLow) {
        instructions.push("Your hemoglobin is low. Eat more iron-rich foods (leafy greens, red meat, lentils) and avoid strenuous activity until your follow-up.");
      } else if (isHigh) {
        instructions.push("Your hemoglobin is elevated. Stay well hydrated and avoid smoking until your follow-up.");
      }
    }

    if (flag.test === "bloodSugar") {
      if (isHigh) {
        instructions.push("Your blood sugar is elevated. Limit sugary foods and refined carbohydrates, and monitor for excessive thirst or fatigue until your follow-up.");
      } else if (isLow) {
        instructions.push("Your blood sugar is low. Keep a fast-acting sugar source (juice, glucose tablets) with you and eat regular small meals until your follow-up.");
      }
    }

    if (flag.test === "wbc") {
      if (isHigh) {
        instructions.push("Your white blood cell count is elevated, which can indicate infection or inflammation. Watch for fever and contact your doctor if you feel worse.");
      } else if (isLow) {
        instructions.push("Your white blood cell count is low. Avoid crowded places and people who are sick, as your infection resistance may be reduced until your follow-up.");
      }
    }
  });

  if (instructions.length === 0 && criticalFlags.length > 0) {
    instructions.push("Some of your lab values are outside the normal range. Please follow up with your doctor as soon as possible.");
  }

  return instructions;
}

module.exports = generatePatientInstructions;