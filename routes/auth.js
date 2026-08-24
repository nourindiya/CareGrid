const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password, role, hospitalName } = req.body;

    if (role !== "patient" && !hospitalName) {
      return res.status(400).json({ error: "Hospital name is required for this role" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      hospitalName: role === "patient" ? null : hospitalName,
    });

    res.json({ message: "Account created", userId: user._id, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      message: "Login successful",
      token: token,
      name: user.name,
      role: user.role,
      hospitalName: user.hospitalName || null,
      userId: String(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;