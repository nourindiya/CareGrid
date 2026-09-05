const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  age: Number,
  phone: String,
  healthProblem: String,
  urgencyScore: { type: Number, default: 0 },
  status: { type: String, default: "waiting" },
});

module.exports = mongoose.model("Patient", patientSchema);