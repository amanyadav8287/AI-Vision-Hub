const mongoose = require("mongoose");

const MODES = ["product", "plant", "food", "electronics", "document"];
const STATUSES = ["pending", "processing", "completed", "failed"];

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mode: {
      type: String,
      enum: MODES,
      required: true,
    },
    image: {
      path: { type: String, required: true },
      originalName: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
    detectedItem: { type: String, default: "" },
    confidence: { type: Number, default: 0 },
    category: { type: String, default: "" },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    processingStatus: {
      type: String,
      enum: STATUSES,
      default: "pending",
    },
    errorMessage: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

scanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Scan", scanSchema);
