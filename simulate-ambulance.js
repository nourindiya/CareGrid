const mongoose = require("mongoose");
require("dotenv").config();
const Ambulance = require("./models/Ambulance");

async function simulate() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/caregrid");
  console.log("Simulating ambulance movement... press Ctrl+C to stop");

  setInterval(async () => {
    const ambulances = await Ambulance.find({ status: "dispatched" });
    for (const amb of ambulances) {
      amb.currentLat += (Math.random() - 0.5) * 0.005;
      amb.currentLng += (Math.random() - 0.5) * 0.005;
      await amb.save();
    }
  }, 3000);
}

simulate();