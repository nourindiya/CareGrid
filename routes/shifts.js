const express = require("express");
const router = express.Router();
const Shift = require("../models/Shift");
const User = require("../models/User");

// Create a shift, but reject if it overlaps with an existing shift for the same staff member on the same date
router.post("/", async (req, res) => {
  try {
    const { staffName, role, hospitalName, shiftDate, startTime, endTime } = req.body;

    if (!staffName || !role || !hospitalName || !shiftDate || !startTime || !endTime) {
      return res.status(400).json({ error: "staffName, role, hospitalName, shiftDate, startTime and endTime are required" });
    }

    const registeredStaff = await User.findOne({ name: staffName, role, hospitalName });
    if (!registeredStaff) {
      return res.status(400).json({ error: "Selected doctor or nurse is not registered for that hospital and role." });
    }

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

    const shift = await Shift.create({
      ...req.body,
      hospitalName,
      role,
    });
    res.json(shift);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { staffName, role, hospitalName } = req.query;
    const filter = {};

    if (staffName) filter.staffName = staffName;
    if (role) filter.role = role;
    if (hospitalName) filter.hospitalName = hospitalName;

    const today = new Date().toISOString().slice(0, 10);
    filter.shiftDate = { $gte: today };

    const shifts = await Shift.find(filter).sort({ shiftDate: 1, startTime: 1 });
    res.json(shifts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const shift = await Shift.findByIdAndDelete(req.params.id);
  if (!shift) return res.status(404).json({ error: "Shift not found" });
  res.json({ message: "Shift removed" });
});

module.exports = router;