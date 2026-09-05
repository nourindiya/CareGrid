const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  bedNumber: { type: String, required: true },
  ward: String,
  status: { type: String, default: "free" },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
});

module.exports = mongoose.model("Bed", bedSchema);