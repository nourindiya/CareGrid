const express = require("express");
const router = express.Router();
const Vitals = require("../models/Vitals");
const Patient = require("../models/Patient");
const LabReport = require("../models/LabReport");
const Prescription = require("../models/Prescription");
const calculateUrgency = require("../utils/urgency");
const sendCriticalAlert = require("../utils/sendSms");

// Nurse submits vitals
router.post("/", async (req, res) => {
  try {
    const { patientId, heartRate, bloodPressure, oxygenLevel } = req.body;

    await Vitals.create({ patientId, heartRate, bloodPressure, oxygenLevel });

    const score = calculateUrgency({ heartRate, oxygenLevel, bloodPressure });

    const updatedPatient = await Patient.findByIdAndUpdate(
      patientId,
      { urgencyScore: score, status: "waiting" },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(400).json({ error: "No patient found with that ID" });
    }

    let smsResult = null;
    const isDangerous = oxygenLevel < 90 || heartRate > 120 || heartRate < 50;

    if (isDangerous) {
      const message = `CareGrid ALERT: Patient ${updatedPatient.name} has critical vitals — HR: ${heartRate}, O2: ${oxygenLevel}%. Urgency Score: ${score}. Please respond immediately.`;
      smsResult = await sendCriticalAlert(message);
    }

    res.json({ message: "Vitals recorded", score, patient: updatedPatient, smsAlert: smsResult });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Waiting list — sorted by urgency, most urgent first
// IMPORTANT: this must come BEFORE /doctor-view/:type, otherwise Express
// will try to match "waiting-list" as a :type parameter instead.
router.get("/waiting-list", async (req, res) => {
  const patients = await Patient.find({ status: "waiting" }).sort({ urgencyScore: -1 });
  res.json(patients);
});

// Doctor view — filtered by visit type, includes vitals + lab + prescriptions
router.get("/doctor-view/:type", async (req, res) => {
  const { type } = req.params;

  let statusFilter = {};
  if (type === "admitted") {
    statusFilter = { status: "admitted" };
  } else {
    statusFilter = { status: "waiting" };
  }

  const patients = await Patient.find(statusFilter).sort({ urgencyScore: -1 });

  const results = await Promise.all(
    patients.map(async (patient) => {
      const latestVitals = await Vitals.findOne({ patientId: patient._id }).sort({ createdAt: -1 });
      const labReports = await LabReport.find({ patientId: patient._id }).sort({ createdAt: -1 });
      const prescriptions = await Prescription.find({ patientId: patient._id }).sort({ createdAt: -1 });
      return {
        patient,
        latestVitals: latestVitals || null,
        labReports,
        prescriptions,
      };
    })
  );

  res.json(results);
});

module.exports = router;