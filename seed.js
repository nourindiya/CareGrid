const mongoose = require("mongoose");
require("dotenv").config();

const Hospital = require("./models/Hospital");
const Doctor = require("./models/Doctor");
const Bed = require("./models/Bed");
const Ambulance = require("./models/Ambulance");
const BillingItem = require("./models/BillingItem");


const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caregrid");
    console.log("MongoDB Connected for seeding");

    // Clear existing data first, so re-running this doesn't create duplicates
    await Hospital.deleteMany({});
    await Doctor.deleteMany({});
    await Bed.deleteMany({});
    await Ambulance.deleteMany({});
    await BillingItem.deleteMany({});

    console.log("Old data cleared");

    // Seed Hospitals
    const hospitals = await Hospital.insertMany([
      { name: "City Hospital", location: "Dhaka", lat: 23.8103, lng: 90.4125 },
      { name: "General Hospital", location: "Chittagong", lat: 22.3569, lng: 91.7832 },
      { name: "National Medical Center", location: "Sylhet", lat: 24.8949, lng: 91.8687 },
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
    
    //seed billing
    const billingItems = await BillingItem.insertMany([
      { name: "General Bed Charge (per day)", category: "Bed", unitCost: 1500 },
      { name: "ICU Bed Charge (per day)", category: "Bed", unitCost: 5000 },
      { name: "Doctor Consultation", category: "Consultation", unitCost: 800 },
      { name: "Specialist Consultation", category: "Consultation", unitCost: 1500 },
      { name: "Lab Test — Basic Panel", category: "Lab", unitCost: 1200 },
      { name: "X-Ray", category: "Lab", unitCost: 900 },
      { name: "Surgery — Minor", category: "Surgery", unitCost: 15000 },
      { name: "Surgery — Major", category: "Surgery", unitCost: 50000 },
      { name: "Ambulance Service", category: "Transport", unitCost: 1000 },
      { name: "Medicine Charges (general)", category: "Medicine", unitCost: 500 },
    ]);
    console.log(`${billingItems.length} billing items seeded`);

    // Seed Ambulances
    const ambulances = await Ambulance.insertMany([
    

      { vehicleNumber: "AMB-01", hospitalName: "City Hospital", status: "available", currentLat: 23.8103, currentLng: 90.4125 },
      { vehicleNumber: "AMB-02", hospitalName: "City Hospital", status: "available", currentLat: 23.8203, currentLng: 90.4225 },
      { vehicleNumber: "AMB-03", hospitalName: "General Hospital", status: "available", currentLat: 22.3569, currentLng: 91.7832 },
      { vehicleNumber: "AMB-04", hospitalName: "General Hospital", status: "available", currentLat: 22.3669, currentLng: 91.7932 },
      { vehicleNumber: "AMB-05", hospitalName: "National Medical Center", status: "available", currentLat: 24.8949, currentLng: 91.8687 },
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