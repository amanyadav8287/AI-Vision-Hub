const Feedback = require("../models/Feedback");
const Scan = require("../models/Scan");
const { success } = require("../utils/response");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * POST /api/feedback
 * Body: { scanId, rating, feedback }
 * Upserts per (userId, scanId) so users can update their rating.
 */
async function submit(req, res, next) {
  try {
    const { scanId, rating, feedback } = req.body;

    const scan = await Scan.findOne({ _id: scanId, userId: req.user._id });
    if (!scan) throw new AppError("Scan not found", 404);

    const doc = await Feedback.findOneAndUpdate(
      { userId: req.user._id, scanId },
      { rating, feedback: feedback || "" },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    return success(res, {
      statusCode: 201,
      message: "Feedback recorded",
      data: doc,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submit };
