const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: String,
  hospitalName: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);