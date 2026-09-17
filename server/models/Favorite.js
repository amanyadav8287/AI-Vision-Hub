const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scan",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate favorites for the same scan by the same user
favoriteSchema.index({ userId: 1, scanId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
