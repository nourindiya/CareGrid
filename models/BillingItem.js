const mongoose = require("mongoose");

const billingItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Bed Charge (per day)", "Doctor Consultation", "ICU Charge"
  category: String, // e.g. "Bed", "Consultation", "Lab", "Medicine", "Surgery"
  unitCost: { type: Number, required: true },
});

module.exports = mongoose.model("BillingItem", billingItemSchema);