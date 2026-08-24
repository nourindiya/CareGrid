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
const labReportRoutes = require("./routes/labReports");
const path = require("path");
const prescriptionRoutes = require("./routes/prescriptions");
const paymentRoutes = require("./routes/payments");
const forecastRoutes = require("./routes/forecast");
const dischargeRoutes = require("./routes/discharge");
const shiftRoutes = require("./routes/shifts");
const alertRoutes = require("./routes/alerts");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/lab-reports", labReportRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use(express.urlencoded({ extended: true }));
app.use("/api/forecast", forecastRoutes);
app.use("/api/discharge", dischargeRoutes);
app.use("/discharge-summaries", express.static(path.join(__dirname, "discharge-summaries")));
connectDB();

app.use("/api/beds", bedRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/alerts", alertRoutes);
app.get("/", (req, res) => {
  res.send("CareGrid backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));