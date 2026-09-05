const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// Doctor sets the expected discharge date for a patient
router.patch("/:patientId/expected-discharge", async (req, res) => {
  try {
    const { expectedDischargeDate, doctorName } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.patientId,
      { expectedDischargeDate, expectedDischargeSetBy: doctorName },
      { new: true }
    );
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.json({ message: "Expected discharge date set", patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all admitted patients, with their expected discharge date (if set)
router.get("/all-admitted", async (req, res) => {
  const admittedPatients = await Patient.find({ status: "admitted" }).sort({ admittedAt: 1 });
  res.json(admittedPatients);
});

module.exports = router;