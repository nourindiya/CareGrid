const express = require("express");
const router = express.Router();
const Bed = require("../models/Bed");

router.post("/", async (req, res) => {
  const bed = await Bed.create(req.body);
  res.json(bed);
});

router.get("/", async (req, res) => {
  const beds = await Bed.find().populate("patientId");
  res.json(beds);
});

router.patch("/:id", async (req, res) => {
  const { status } = req.body;
  const bed = await Bed.findById(req.params.id);
  if (!bed) return res.status(404).json({ error: "Bed not found" });

  if (status === "occupied" && bed.status !== "free") {
    return res.status(400).json({ error: "Bed is not free" });
  }

  bed.status = status;
  await bed.save();
  res.json(bed);
});

// Delete a bed
router.delete("/:id", async (req, res) => {
  const bed = await Bed.findByIdAndDelete(req.params.id);
  if (!bed) return res.status(404).json({ error: "Bed not found" });
  res.json({ message: "Bed deleted" });
});

module.exports = router;