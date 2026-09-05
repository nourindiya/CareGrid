const express = require("express");
const router = express.Router();
const Ambulance = require("../models/Ambulance");
const Hospital = require("../models/Hospital");
const { getDistanceKm, estimateETA } = require("../utils/distance");

// Add an ambulance (admin setup / seeding)
router.post("/", async (req, res) => {
  const ambulance = await Ambulance.create(req.body);
  res.json(ambulance);
});

// VIEW 1 — Free ambulances only, with their current location
router.get("/available", async (req, res) => {
  const ambulances = await Ambulance.find({ status: "available" });
  res.json(ambulances);
});

// VIEW 2 — Dispatched ambulances only, with full trip details
router.get("/dispatched", async (req, res) => {
  const ambulances = await Ambulance.find({ status: "dispatched" }).populate("patientId");
  res.json(ambulances);
});

// List everything (used internally by the map page)
router.get("/", async (req, res) => {
  const ambulances = await Ambulance.find().populate("patientId");
  res.json(ambulances);
});

// BOOK — manually book a specific ambulance, calculates ETA based on real hospital coordinates
router.post("/:id/book", async (req, res) => {
  try {
    const { patientId, fromHospital, toHospital } = req.body;
    const ambulance = await Ambulance.findById(req.params.id);

    if (!ambulance) return res.status(404).json({ error: "Ambulance not found" });
    if (ambulance.status !== "available") return res.status(400).json({ error: "This ambulance is not free" });

    const sendingHospital = await Hospital.findOne({ name: fromHospital });
    const pickupLat = sendingHospital ? sendingHospital.lat : 23.8103;
    const pickupLng = sendingHospital ? sendingHospital.lng : 90.4125;

    const distanceKm = getDistanceKm(ambulance.currentLat, ambulance.currentLng, pickupLat, pickupLng);
    const etaMinutes = estimateETA(distanceKm);

    ambulance.status = "dispatched";
    ambulance.patientId = patientId;
    ambulance.fromHospital = fromHospital;
    ambulance.toHospital = toHospital;
    ambulance.pickupLat = pickupLat;
    ambulance.pickupLng = pickupLng;
    ambulance.dispatchedAt = new Date();
    ambulance.etaMinutes = etaMinutes;
    await ambulance.save();

    res.json({
      message: "Ambulance booked",
      ambulance,
      distanceKm: distanceKm.toFixed(1),
      etaMinutes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark an ambulance as having arrived / trip complete — frees it up again
router.patch("/:id/complete", async (req, res) => {
  const ambulance = await Ambulance.findByIdAndUpdate(
    req.params.id,
    {
      status: "available",
      patientId: null,
      fromHospital: null,
      toHospital: null,
      dispatchedAt: null,
      etaMinutes: null,
    },
    { new: true }
  );
  if (!ambulance) return res.status(404).json({ error: "Ambulance not found" });
  res.json({ message: "Trip completed — ambulance is now available", ambulance });
});

// Delete an ambulance
router.delete("/:id", async (req, res) => {
  const ambulance = await Ambulance.findByIdAndDelete(req.params.id);
  if (!ambulance) return res.status(404).json({ error: "Ambulance not found" });
  res.json({ message: "Ambulance deleted" });
});

module.exports = router;