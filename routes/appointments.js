const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Bed = require("../models/Bed");
const checkSeverity = require("../utils/severity");

router.post("/", async (req, res) => {
  try {
    const { name, age, phone, healthProblem, userId, doctorName, hospitalName } = req.body;
    const patient = await Patient.create({ name, age, phone, healthProblem, userId: userId || null });
    const result = await bookForPatient(patient, doctorName, hospitalName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/for-patient", async (req, res) => {
  try {
    const { patientId, doctorName, hospitalName } = req.body;
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const result = await bookForPatient(patient, doctorName, hospitalName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function bookForPatient(patient, doctorName, hospitalName) {
  const type = checkSeverity(patient.healthProblem || "");
  const isCriticalCase = ["chest pain", "difficulty breathing", "severe bleeding", "stroke"].some((p) =>
    (patient.healthProblem || "").toLowerCase().includes(p)
  );
  const preferredWard = isCriticalCase ? "ICU" : "General";

  if (type === "visit") {
    const appointment = await Appointment.create({
      patientId: patient._id,
      type: "visit",
      doctorName: doctorName || "Any available doctor",
      timeSlot: "Next available slot",
    });
    return { message: "Appointment booked", appointment, patientId: patient._id };
  } else {
    let freeBed = null;

    // Step 1: try the patient's own hospital, matching ward preference (ICU for critical cases)
    if (hospitalName) {
      freeBed = await Bed.findOneAndUpdate(
        { hospitalName, ward: preferredWard, status: "free" },
        { status: "occupied", patientId: patient._id },
        { new: true }
      );
    }

    // Step 2: same hospital, but any ward, if preferred ward wasn't free
    if (!freeBed && hospitalName) {
      freeBed = await Bed.findOneAndUpdate(
        { hospitalName, status: "free" },
        { status: "occupied", patientId: patient._id },
        { new: true }
      );
    }

    // Step 3: no hospital specified, or their hospital has nothing free — fall back to ANY hospital, matching ward preference
    if (!freeBed) {
      freeBed = await Bed.findOneAndUpdate(
        { ward: preferredWard, status: "free" },
        { status: "occupied", patientId: patient._id },
        { new: true }
      );
    }

    // Step 4: absolute last resort — any free bed anywhere
    if (!freeBed) {
      freeBed = await Bed.findOneAndUpdate(
        { status: "free" },
        { status: "occupied", patientId: patient._id },
        { new: true }
      );
    }

    if (!freeBed) {
      return { message: "No bed free anywhere — needs transfer", needsTransfer: true, patientId: patient._id };
    }

    patient.status = "admitted";
    patient.admittedAt = new Date();
    await patient.save();

    const appointment = await Appointment.create({
      patientId: patient._id,
      type: "admission",
    });
    return {
      message: freeBed.hospitalName === hospitalName
        ? "Bed reserved at your hospital"
        : `No bed free at your hospital — reserved at ${freeBed.hospitalName} instead`,
      appointment,
      bed: freeBed,
      patientId: patient._id,
    };
  }
}

module.exports = router;