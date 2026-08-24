const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  bedNumber: { type: String, required: true },
  ward: String,
  status: { type: String, default: "free" }, // free, occupied, cleaning
});

module.exports = mongoose.model("Bed", bedSchema);