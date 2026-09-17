/**
 * OCR Service — pluggable text extraction from document images.
 *
 * Providers:
 *   - "mock"   : returns placeholder text (no external call)
 *   - "tesseract" / "google" / "azure" : wire into real OCR APIs
 *
 * Controllers call `extractText(imagePath)`.
 */

const fs = require("fs");
const axios = require("axios");
const env = require("../config/env");
const { AppError } = require("../middleware/errorMiddleware");

const mockOcr = {
  async extractText(imagePath) {
    if (!fs.existsSync(imagePath)) {
      throw new AppError(`Image not found at ${imagePath}`, 400);
    }
    return {
      text:
        "Sample extracted text from the mock OCR engine. " +
        "In production this would be replaced with Tesseract, Google Vision, Azure Computer Vision, or another OCR provider. " +
        "Paragraphs, headings and numbers would be preserved as accurately as possible.",
      confidence: 0.9,
      language: "en",
      provider: "mock",
    };
  },
};

const httpOcr = {
  async extractText(imagePath) {
    if (!env.OCR_API_URL || !env.OCR_API_KEY) {
      throw new AppError("OCR_API_URL and OCR_API_KEY must be set.", 500);
    }
    const imageBase64 = fs.readFileSync(imagePath).toString("base64");
    const { data } = await axios.post(
      env.OCR_API_URL,
      { imageBase64 },
      {
        headers: {
          Authorization: `Bearer ${env.OCR_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60_000,
      }
    );
    return data;
  },
};

function getProvider() {
  switch ((env.OCR_PROVIDER || "mock").toLowerCase()) {
    case "mock":
      return mockOcr;
    case "http":
    case "custom":
      return httpOcr;
    default:
      return mockOcr;
  }
}

async function extractText(imagePath) {
  try {
    return await getProvider().extractText(imagePath);
  } catch (err) {
    if (err.isOperational) throw err;
    throw new AppError(`OCR failed: ${err.message || "unknown error"}`, 502);
  }
}

module.exports = { extractText };
