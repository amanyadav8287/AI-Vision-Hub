const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      autoIndex: env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );

    return conn;
  } catch (err) {
    console.error("[db] MongoDB connection error:", err);
    throw err;
  }
}

module.exports = connectDB;