const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  lat: { type: Number, default: 23.8103 },
  lng: { type: Number, default: 90.4125 },
  status: { type: String, default: "active" },
  dataAccess: {
    beds: { type: Boolean, default: true },
    appointments: { type: Boolean, default: true },
    transfers: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model("Hospital", hospitalSchema);