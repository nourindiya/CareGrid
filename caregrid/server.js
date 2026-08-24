const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const bedRoutes = require("./routes/beds");
const appointmentRoutes = require("./routes/appointments");
const vitalsRoutes = require("./routes/vitals");
const transferRoutes = require("./routes/transfers");
const authRoutes = require("./routes/auth");
const ambulanceRoutes = require("./routes/ambulances");
const hospitalRoutes = require("./routes/hospitals");
const doctorRoutes = require("./routes/doctors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

connectDB();

app.use("/api/beds", bedRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);

app.get("/", (req, res) => {
  res.send("CareGrid backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));