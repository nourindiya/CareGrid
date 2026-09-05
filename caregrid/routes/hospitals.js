const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

// Add a hospital to the network
router.post("/", async (req, res) => {
  const hospital = await Hospital.create(req.body);
  res.json(hospital);
});

// List every connected hospital
router.get("/", async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
});

// Update a hospital's data access permissions or status
router.patch("/:id", async (req, res) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!hospital) return res.status(404).json({ error: "Hospital not found" });
  res.json(hospital);
});

// Delete a hospital
router.delete("/:id", async (req, res) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  if (!hospital) return res.status(404).json({ error: "Hospital not found" });
  res.json({ message: "Hospital deleted" });
});

module.exports = router;