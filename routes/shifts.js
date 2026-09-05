const express = require("express");
const router = express.Router();
const Shift = require("../models/Shift");

// Create a shift, but reject if it overlaps with an existing shift for the same staff member on the same date
router.post("/", async (req, res) => {
  try {
    const { staffName, shiftDate, startTime, endTime } = req.body;

    const conflict = await Shift.findOne({
      staffName,
      shiftDate,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });

    if (conflict) {
      return res.status(400).json({ error: `${staffName} already has a shift on ${shiftDate} that overlaps this time` });
    }

    const shift = await Shift.create(req.body);
    res.json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const shifts = await Shift.find().sort({ shiftDate: 1, startTime: 1 });
  res.json(shifts);
});

router.delete("/:id", async (req, res) => {
  const shift = await Shift.findByIdAndDelete(req.params.id);
  if (!shift) return res.status(404).json({ error: "Shift not found" });
  res.json({ message: "Shift removed" });
});

module.exports = router;