const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  hospitalName: String, // home base hospital
  status: { type: String, default: "available" }, // available, dispatched
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
  fromHospital: { type: String, default: null },
  toHospital: { type: String, default: null },
  pickupLat: { type: Number, default: null },
  pickupLng: { type: Number, default: null },
  dispatchedAt: { type: Date, default: null },
  etaMinutes: { type: Number, default: null },
  currentLat: { type: Number, default: 23.8103 },
  currentLng: { type: Number, default: 90.4125 },
});

module.exports = mongoose.model("Ambulance", ambulanceSchema);