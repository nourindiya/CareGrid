const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  status: { type: String, default: "active" }, // active, suspended
  dataAccess: {
    beds: { type: Boolean, default: true },
    appointments: { type: Boolean, default: true },
    transfers: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model("Hospital", hospitalSchema);