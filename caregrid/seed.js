const mongoose = require("mongoose");
require("dotenv").config();

const Hospital = require("./models/Hospital");
const Doctor = require("./models/Doctor");
const Bed = require("./models/Bed");
const Ambulance = require("./models/Ambulance");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caregrid");
    console.log("MongoDB Connected for seeding");

    // Clear existing data first, so re-running this doesn't create duplicates
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Bed.deleteMany({});
    await Ambulance.deleteMany({});
    console.log("Old data cleared");

    // Seed Hospitals
    const hospitals = await Hospital.insertMany([
      { name: "City Hospital", location: "Dhaka" },
      { name: "General Hospital", location: "Chittagong" },
      { name: "National Medical Center", location: "Sylhet" },
    ]);
    console.log(`${hospitals.length} hospitals seeded`);

    // Seed Doctors
    const doctors = await Doctor.insertMany([
      { name: "Dr. Rahman", specialty: "General Physician", hospitalName: "City Hospital" },
      { name: "Dr. Ayesha Karim", specialty: "Cardiologist", hospitalName: "City Hospital" },
      { name: "Dr. Farhan Islam", specialty: "Pediatrician", hospitalName: "General Hospital" },
      { name: "Dr. Nusrat Jahan", specialty: "Orthopedic", hospitalName: "National Medical Center" },
    ]);
    console.log(`${doctors.length} doctors seeded`);

    // Seed Beds
    const beds = await Bed.insertMany([
      { hospitalName: "City Hospital", bedNumber: "A1", ward: "General", status: "free" },
      { hospitalName: "City Hospital", bedNumber: "A2", ward: "General", status: "free" },
      { hospitalName: "City Hospital", bedNumber: "ICU1", ward: "ICU", status: "free" },
      { hospitalName: "General Hospital", bedNumber: "B1", ward: "General", status: "free" },
      { hospitalName: "General Hospital", bedNumber: "ICU2", ward: "ICU", status: "free" },
      { hospitalName: "National Medical Center", bedNumber: "C1", ward: "General", status: "free" },
    ]);
    console.log(`${beds.length} beds seeded`);

    // Seed Ambulances
    const ambulances = await Ambulance.insertMany([
      { vehicleNumber: "AMB-01", hospitalName: "City Hospital", status: "available" },
      { vehicleNumber: "AMB-02", hospitalName: "General Hospital", status: "available" },
      { vehicleNumber: "AMB-03", hospitalName: "National Medical Center", status: "available" },
    ]);
    console.log(`${ambulances.length} ambulances seeded`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();