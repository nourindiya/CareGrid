const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  frequency: String,
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorName: { type: String, required: true },
  medicines: { type: [medicineSchema], default: [] },
  notes: { type: String, default: "" },
  isFinal: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);