const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const BillingItem = require("../models/BillingItem");

// List all available billing items (used to build the bill on the frontend)
router.get("/items", async (req, res) => {
  const items = await BillingItem.find();
  res.json(items);
});

// CREATE a new bill for a patient, built from selected items
router.post("/create-bill", async (req, res) => {
  try {
    const { patientId, billLines } = req.body; // billLines: [{ itemName, quantity, unitCost }]

    const linesWithTotals = billLines.map((line) => ({
      ...line,
      lineTotal: line.quantity * line.unitCost,
    }));

    const totalBill = linesWithTotals.reduce((sum, line) => sum + line.lineTotal, 0);
    const transactionId = "CG" + Date.now();

    const payment = await Payment.create({
      patientId,
      transactionId,
      billLines: linesWithTotals,
      totalBill,
      depositPaid: 0,
      amountDue: totalBill,
      status: "open",
    });

    res.json({ message: "Bill created", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pay a deposit against an existing bill (simulated, instant)
router.post("/:transactionId/deposit", async (req, res) => {
  try {
    const { amount } = req.body;
    const payment = await Payment.findOne({ transactionId: req.params.transactionId });
    if (!payment) return res.status(404).json({ error: "Bill not found" });

    payment.depositPaid += Number(amount);
    payment.amountDue = payment.totalBill - payment.depositPaid;
    payment.status = payment.amountDue <= 0 ? "settled" : "deposit_paid";
    await payment.save();

    res.json({ message: "Deposit recorded", payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single bill by transaction ID (used to display current status + invoice)
router.get("/:transactionId", async (req, res) => {
  const payment = await Payment.findOne({ transactionId: req.params.transactionId }).populate("patientId");
  if (!payment) return res.status(404).json({ error: "Bill not found" });
  res.json(payment);
});

// Get all bills for a patient
router.get("/patient/:patientId", async (req, res) => {
  const payments = await Payment.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
  res.json(payments);
});

module.exports = router;