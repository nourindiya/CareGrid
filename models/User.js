const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "nurse", "doctor", "hospital_admin", "network_admin"],
    required: true,
  },
  hospitalName: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);