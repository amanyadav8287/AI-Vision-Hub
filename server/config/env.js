const dotenv = require("dotenv");
const path = require("path");

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://amanyad8076_db_user:oETaV730Ir9L6kRb@aivisionhub.5avws0q.mongodb.net/?appName=AIVisionHub",

  JWT_SECRET: process.env.JWT_SECRET || "please-set-jwt-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  AI_PROVIDER: process.env.AI_PROVIDER || "gemini",
  AI_API_KEY: process.env.AI_API_KEY || "",
  AI_API_URL: process.env.AI_API_URL || "",

  OCR_PROVIDER: process.env.OCR_PROVIDER || "mock",
  OCR_API_KEY: process.env.OCR_API_KEY || "",
  OCR_API_URL: process.env.OCR_API_URL || "",

  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

// Warn about critical missing values in production
if (env.NODE_ENV === "production") {
  if (env.JWT_SECRET === "please-set-jwt-secret") {
    console.warn("[env] WARNING: JWT_SECRET is using the default value.");
  }
  if (!env.MONGO_URI) {
    console.warn("[env] WARNING: MONGO_URI is not set.");
  }
}

module.exports = env;
