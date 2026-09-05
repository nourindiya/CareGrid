const express = require("express");
const router = express.Router();
const TransferRequest = require("../models/TransferRequest");
const Bed = require("../models/Bed");
const sendDiscordAlert = require("../utils/sendDiscordAlert");

// CREATE — Hospital Admin sends a transfer request
router.post("/", async (req, res) => {
  try {
    const { patientId, fromHospital, toHospital, equipmentNeeded } = req.body;
    const transfer = await TransferRequest.create({
      patientId, fromHospital, toHospital, equipmentNeeded,
    });
    res.json({ message: "Transfer request sent to Network Admin", transfer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ — list all transfer requests
router.get("/", async (req, res) => {
  const transfers = await TransferRequest.find()
    .populate("patientId")
    .sort({ createdAt: -1 });
  res.json(transfers);
});

// UPDATE — Network Admin assigns a bed from ANY hospital based on availability
router.patch("/:id/assign", async (req, res) => {
  const { bedId } = req.body;
  const transfer = await TransferRequest.findById(req.params.id).populate("patientId");
  if (!transfer) return res.status(404).json({ error: "Transfer request not found" });
  if (transfer.status !== "pending") {
    return res.status(400).json({ error: "This request has already been handled" });
  }

  const bed = await Bed.findById(bedId);
  if (!bed || bed.status !== "free") {
    return res.status(400).json({ error: "Selected bed is not available" });
  }

  bed.status = "occupied";
  bed.patientId = transfer.patientId;
  await bed.save();

  transfer.status = "approved";
  transfer.assignedBedId = bed._id;
  transfer.assignedHospital = bed.hospitalName;
  await transfer.save();

  await sendDiscordAlert(`🔄 **Transfer Approved**\nPatient: ${transfer.patientId.name}\nFrom: ${transfer.fromHospital}\nAssigned to: ${bed.hospitalName}, Bed ${bed.bedNumber}`);
  
  res.json({ message: "Bed assigned — now book an ambulance from the Ambulance Tracking page", transfer });
});

// UPDATE — Network Admin rejects a request
router.patch("/:id/reject", async (req, res) => {
  const transfer = await TransferRequest.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true }
  );
  if (!transfer) return res.status(404).json({ error: "Transfer request not found" });
  res.json({ message: "Transfer rejected", transfer });
});

// DELETE — remove a transfer request record
router.delete("/:id", async (req, res) => {
  const transfer = await TransferRequest.findByIdAndDelete(req.params.id);
  if (!transfer) return res.status(404).json({ error: "Transfer request not found" });
  res.json({ message: "Transfer request deleted" });
});

module.exports = router;