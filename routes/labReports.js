const express = require("express");
const router = express.Router();
const multer = require("multer");
const Tesseract = require("tesseract.js");
const LabReport = require("../models/LabReport");
const parseLabText = require("../utils/labParser");
const checkCriticalValues = require("../utils/labSafetyCheck");
const generatePatientInstructions = require("../utils/patientInstructions");
const Patient = require("../models/Patient");

const upload = multer({ dest: "uploads/" });

// Upload a lab report photo — OCR reads it automatically
router.post("/", upload.single("labImage"), async (req, res) => {
  try {
    const { patientId } = req.body;
    const imagePath = req.file.path;

    const result = await Tesseract.recognize(imagePath, "eng");
    const extractedText = result.data.text;
    const extractedValues = parseLabText(extractedText);

    const criticalFlags = checkCriticalValues(extractedValues);
    const isCritical = criticalFlags.length > 0;
    const patientInstructions = isCritical ? generatePatientInstructions(criticalFlags) : [];

    const labReport = await LabReport.create({
      patientId,
      imagePath,
      extractedText,
      extractedValues,
      criticalFlags,
      isCritical,
      patientInstructions,
    });

    res.json({ message: "Lab report scanned", labReport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all lab reports for a patient
router.get("/patient/:patientId", async (req, res) => {
  const reports = await LabReport.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
  res.json(reports);
});
// All lab reports currently flagged as critical (for the doctor's alert dashboard)
router.get("/critical", async (req, res) => {
  const now = new Date();

  const reports = await LabReport.find({
    isCritical: true,
    $or: [
      { resolutionStatus: "open" },
      { resolutionStatus: "acknowledged" },
      { resolutionStatus: "snoozed", snoozedUntil: { $lte: now } }, // snooze expired, show again
    ],
  })
    .populate("patientId")
    .sort({ createdAt: -1 });

  res.json(reports);
});

// Doctor updates the resolution status of a critical lab report
router.patch("/:id/resolve", async (req, res) => {
  try {
    const { resolutionStatus, resolutionNote, resolvedBy, snoozeHours } = req.body;

    if (!resolutionNote || resolutionNote.trim() === "") {
      return res.status(400).json({ error: "A note is required to update this alert" });
    }

    const updateData = {
      resolutionStatus,
      resolutionNote,
      resolvedBy,
      resolvedAt: new Date(),
    };

    if (resolutionStatus === "snoozed") {
      const hours = snoozeHours || 4;
      updateData.snoozedUntil = new Date(Date.now() + hours * 60 * 60 * 1000);
    } else {
      updateData.snoozedUntil = null;
    }

    const report = await LabReport.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!report) return res.status(404).json({ error: "Lab report not found" });

    res.json({ message: "Alert updated", report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get patient instructions for a specific patient (used by the patient portal)
router.get("/patient/:patientId/instructions", async (req, res) => {
  const reports = await LabReport.find({
    patientId: req.params.patientId,
    isCritical: true,
    patientInstructions: { $ne: [] },
  }).sort({ createdAt: -1 });

  res.json(reports);
});


// Get lab instructions for a logged-in Patient, via their userId
router.get("/my-instructions/:userId", async (req, res) => {
  const patients = await Patient.find({ userId: req.params.userId });
  const patientIds = patients.map((p) => p._id);

  const reports = await LabReport.find({
    patientId: { $in: patientIds },
    isCritical: true,
    patientInstructions: { $ne: [] },
  }).sort({ createdAt: -1 });

  res.json(reports);
});


module.exports = router;