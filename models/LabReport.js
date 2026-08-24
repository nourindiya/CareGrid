const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  imagePath: String,
  extractedText: String,
  extractedValues: {
    hemoglobin: Number,
    bloodSugar: Number,
    wbc: Number,
  },
  criticalFlags: { type: Array, default: [] },
  isCritical: { type: Boolean, default: false },
  patientInstructions: { type: [String], default: [] },

  resolutionStatus: {
    type: String,
    enum: ["open", "acknowledged", "snoozed", "resolved"],
    default: "open",
  },
  resolutionNote: { type: String, default: "" },
  resolvedBy: { type: String, default: null },
  resolvedAt: { type: Date, default: null },
  snoozedUntil: { type: Date, default: null },

  status: { type: String, default: "processed" },
}, { timestamps: true });

module.exports = mongoose.model("LabReport", labReportSchema);