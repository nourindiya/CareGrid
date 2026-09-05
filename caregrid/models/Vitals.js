const mongoose = require("mongoose");

const vitalsSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  heartRate: Number,
  bloodPressure: String,
  oxygenLevel: Number,
});

module.exports = mongoose.model("Vitals", vitalsSchema);