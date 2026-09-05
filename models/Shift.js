const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema({
  staffName: { type: String, required: true },
  role: { type: String, enum: ["doctor", "nurse"], required: true },
  department: String,
  hospitalName: String,
  shiftDate: { type: String, required: true }, // "2026-08-20"
  shiftType: { type: String, enum: ["12hr", "24hr"], default: "12hr" },
  startTime: String, // "08:00"
  endTime: String,   // "20:00"
});

module.exports = mongoose.model("Shift", shiftSchema);