const dns = require("dns");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is missing in .env");
    }

    dns.setServers(["8.8.8.8", "1.1.1.1"]);

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed");
    console.error("Reason:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
