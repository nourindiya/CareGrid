const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  hospitalName: String,
  status: { type: String, default: "available" }, // available, dispatched
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
  pickupLocation: String,
});

module.exports = mongoose.model("Ambulance", ambulanceSchema);