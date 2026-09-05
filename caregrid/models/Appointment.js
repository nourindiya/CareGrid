const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  type: String, // "visit" or "admission"
  doctorName: String,
  timeSlot: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);