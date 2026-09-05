const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/CareGrid";
    const conn = await mongoose.connect(mongoUri, {
      dbName: "CareGrid",
    });
    console.log("MongoDB Connected");
    console.log(conn.connection.host);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;