const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// Add a doctor (for testing / admin setup)
router.post("/", async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.json(doctor);
});

// List all doctors — used to fill the dropdown on the booking page
router.get("/", async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
});

// Delete a doctor
router.delete("/:id", async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json({ error: "Doctor not found" });
  res.json({ message: "Doctor deleted" });
});

module.exports = router;