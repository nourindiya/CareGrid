const mongoose = require("mongoose");

const dischargeSummarySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  bedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed" },
  finalPrescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  pdfPath: String,
  isLocked: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("DischargeSummary", dischargeSummarySchema);