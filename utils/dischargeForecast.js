const Patient = require("../models/Patient");

// Studies past discharged patients with the same health problem, averages their stay length
async function forecastDischarge(healthProblem) {
  const pastPatients = await Patient.find({
    healthProblem: { $regex: healthProblem, $options: "i" },
    status: "discharged",
    admittedAt: { $ne: null },
    dischargedAt: { $ne: null },
  });

  if (pastPatients.length === 0) {
    return { averageDays: null, basedOnRecords: 0, message: "No historical data yet for this condition" };
  }

  const totalDays = pastPatients.reduce((sum, p) => {
    const days = (new Date(p.dischargedAt) - new Date(p.admittedAt)) / (1000 * 60 * 60 * 24);
    return sum + days;
  }, 0);

  const averageDays = totalDays / pastPatients.length;

  return {
    averageDays: Math.round(averageDays * 10) / 10,
    basedOnRecords: pastPatients.length,
  };
}

module.exports = forecastDischarge;