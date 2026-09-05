const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const Patient = require("../models/Patient");

// CREATE a new prescription
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorName, medicines, notes } = req.body;
    if (!patientId || !doctorName) {
      return res.status(400).json({ error: "patientId and doctorName are required" });
    }
    const prescription = await Prescription.create({
      patientId,
      doctorName,
      medicines: medicines || [],
      notes: notes || "",
    });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all prescriptions for a specific patientId (most recent first)
router.get("/patient/:patientId", async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all prescriptions belonging to a logged-in Patient's account (via their userId)
router.get("/my/:userId", async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.params.userId });
    const patientIds = patients.map((p) => p._id);

    const prescriptions = await Prescription.find({ patientId: { $in: patientIds } })
      .populate("patientId")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one prescription by its own ID
router.get("/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD a medicine to a prescription
router.post("/:id/medicines", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });
    if (prescription.isFinal) return res.status(400).json({ error: "Prescription is locked" });

    const { name, dosage, frequency } = req.body;
    prescription.medicines.push({ name, dosage, frequency });
    await prescription.save();
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE one medicine by index
router.patch("/:id/medicines/:index", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });
    if (prescription.isFinal) return res.status(400).json({ error: "Prescription is locked" });

    const index = parseInt(req.params.index);
    if (!prescription.medicines[index]) return res.status(404).json({ error: "Medicine not found" });

    const current = prescription.medicines[index];
    prescription.medicines[index] = {
      name: req.body.name !== undefined ? req.body.name : current.name,
      dosage: req.body.dosage !== undefined ? req.body.dosage : current.dosage,
      frequency: req.body.frequency !== undefined ? req.body.frequency : current.frequency,
    };
    await prescription.save();
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE one medicine by index
router.delete("/:id/medicines/:index", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });
    if (prescription.isFinal) return res.status(400).json({ error: "Prescription is locked" });

    const index = parseInt(req.params.index);
    if (!prescription.medicines[index]) return res.status(404).json({ error: "Medicine not found" });

    prescription.medicines.splice(index, 1);
    await prescription.save();
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE prescription notes / doctorName
router.patch("/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });
    if (prescription.isFinal) return res.status(400).json({ error: "Prescription is locked" });

    if (req.body.notes !== undefined) prescription.notes = req.body.notes;
    if (req.body.doctorName !== undefined) prescription.doctorName = req.body.doctorName;
    await prescription.save();
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a whole prescription
router.delete("/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    if (!prescription) return res.status(404).json({ error: "Prescription not found" });
    if (prescription.isFinal) return res.status(400).json({ error: "Cannot delete a finalized prescription" });

    await prescription.deleteOne();
    res.json({ message: "Prescription deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;