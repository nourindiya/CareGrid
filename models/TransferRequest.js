const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  fromHospital: String,
  toHospital: String, // hospital originally requested (preference only)
  equipmentNeeded: [String],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  assignedBedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed", default: null },
  assignedHospital: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("TransferRequest", transferSchema);