const mongoose = require("mongoose");

const billLineSchema = new mongoose.Schema({
  itemName: String,
  quantity: { type: Number, default: 1 },
  unitCost: Number,
  lineTotal: Number,
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  transactionId: String,
  billLines: [billLineSchema],
  totalBill: { type: Number, default: 0 },
  depositPaid: { type: Number, default: 0 },
  amountDue: { type: Number, default: 0 },
  status: { type: String, default: "open" }, // open, deposit_paid, settled
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);