const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Patient = require("../models/Patient");
const Bed = require("../models/Bed");
const Prescription = require("../models/Prescription");
const Vitals = require("../models/Vitals");
const LabReport = require("../models/LabReport");
const DischargeSummary = require("../models/DischargeSummary");

router.post("/:patientId", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    // Automatically find this patient's most recent prescription
    const latestPrescription = await Prescription.findOne({ patientId: patient._id }).sort({ createdAt: -1 });
    let finalPrescription = null;
    if (latestPrescription) {
      finalPrescription = await Prescription.findByIdAndUpdate(
        latestPrescription._id,
        { isFinal: true },
        { new: true }
      );
    }

    // Automatically find the bed this patient is currently in
    const patientBed = await Bed.findOne({ patientId: patient._id, status: "occupied" });

    const vitalsHistory = await Vitals.find({ patientId: patient._id }).sort({ createdAt: 1 });
    const labHistory = await LabReport.find({ patientId: patient._id }).sort({ createdAt: 1 });

    if (!fs.existsSync("discharge-summaries")) fs.mkdirSync("discharge-summaries");
    const fileName = `discharge-${patient._id}-${Date.now()}.pdf`;
    const filePath = path.join("discharge-summaries", fileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("CareGrid — Discharge Summary", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Patient: ${patient.name}`);
    doc.text(`Age: ${patient.age || "-"}`);
    doc.text(`Health Problem: ${patient.healthProblem || "-"}`);
    doc.text(`Admitted: ${patient.admittedAt ? new Date(patient.admittedAt).toLocaleString() : "-"}`);
    doc.text(`Discharged: ${new Date().toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(14).text("Vitals History", { underline: true });
    if (vitalsHistory.length === 0) doc.fontSize(10).text("No vitals recorded.");
    vitalsHistory.forEach((v) => {
      doc.fontSize(10).text(`${new Date(v.createdAt).toLocaleString()} — HR: ${v.heartRate}, BP: ${v.bloodPressure}, O2: ${v.oxygenLevel}%`);
    });
    doc.moveDown();

    doc.fontSize(14).text("Lab Results", { underline: true });
    if (labHistory.length === 0) doc.fontSize(10).text("No lab reports.");
    labHistory.forEach((l) => {
      doc.fontSize(10).text(`${new Date(l.createdAt).toLocaleString()} — Hb: ${l.extractedValues.hemoglobin ?? "-"}, Sugar: ${l.extractedValues.bloodSugar ?? "-"}, WBC: ${l.extractedValues.wbc ?? "-"}`);
    });
    doc.moveDown();

    doc.fontSize(14).text("Final Prescription", { underline: true });
    if (finalPrescription) {
      doc.fontSize(10).text(`Doctor: ${finalPrescription.doctorName}`);
      finalPrescription.medicines.forEach((m) => {
        doc.text(`- ${m.name}, ${m.dosage}, ${m.frequency}`);
      });
      doc.text(`Notes: ${finalPrescription.notes || "-"}`);
    } else {
      doc.fontSize(10).text("No prescription on file.");
    }

    doc.end();

    // Automatically release the bed we found
    if (patientBed) {
      await Bed.findByIdAndUpdate(patientBed._id, { status: "free", patientId: null });
    }

    patient.status = "discharged";
    patient.dischargedAt = new Date();
    await patient.save();

    const summary = await DischargeSummary.create({
      patientId: patient._id,
      bedId: patientBed ? patientBed._id : null,
      finalPrescriptionId: finalPrescription ? finalPrescription._id : null,
      pdfPath: filePath,
    });

    res.json({
      message: patientBed
        ? "Patient discharged, bed released, summary generated"
        : "Patient discharged, summary generated (no occupied bed was found for this patient)",
      summary,
      pdfUrl: `/discharge-summaries/${fileName}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/patient/:patientId", async (req, res) => {
  const summaries = await DischargeSummary.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
  res.json(summaries);
});

module.exports = router;