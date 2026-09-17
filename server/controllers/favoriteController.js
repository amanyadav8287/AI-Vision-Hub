const Favorite = require("../models/Favorite");
const Scan = require("../models/Scan");
const { success } = require("../utils/response");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * POST /api/favorites/:scanId
 */
async function add(req, res, next) {
  try {
    const scan = await Scan.findOne({ _id: req.params.scanId, userId: req.user._id });
    if (!scan) throw new AppError("Scan not found", 404);

    // Prevent duplicates
    let favorite = await Favorite.findOne({
      userId: req.user._id,
      scanId: scan._id,
    });
    if (!favorite) {
      favorite = await Favorite.create({
        userId: req.user._id,
        scanId: scan._id,
      });
    }

    return success(res, {
      statusCode: 201,
      message: "Added to favorites",
      data: favorite,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/favorites/:scanId
 */
async function remove(req, res, next) {
  try {
    const result = await Favorite.findOneAndDelete({
      userId: req.user._id,
      scanId: req.params.scanId,
    });
    if (!result) throw new AppError("Favorite not found", 404);
    return success(res, { message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/favorites
 */
async function list(req, res, next) {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "scanId",
        select: "mode image detectedItem confidence category result processingStatus createdAt",
      })
      .lean();

    // Filter out favorites whose scan was deleted, and flatten
    const scans = favorites
      .filter((f) => f.scanId)
      .map((f) => ({ ...f.scanId, favoritedAt: f.createdAt }));

    return success(res, { data: scans });
  } catch (err) {
    next(err);
  }
}

module.exports = { add, remove, list };
