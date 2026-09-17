/**
 * Scan Service — business logic for scans.
 * Controllers stay thin; this module orchestrates upload → AI → persistence.
 */

const fs = require("fs");
const Scan = require("../models/Scan");
const aiService = require("./aiService");
const ocrService = require("./ocrService");
const { AppError } = require("../middleware/errorMiddleware");

const VALID_MODES = ["product", "plant", "food", "electronics", "document"];

/**
 * Create a scan, send it to the AI service, and persist the structured result.
 */
async function createScan({ userId, mode, file }) {
  if (!VALID_MODES.includes(mode)) {
    throw new AppError(`Unsupported mode: ${mode}`, 400);
  }
  if (!file || !file.path) {
    throw new AppError("Image is required", 400);
  }

  // 1. Create the scan in "pending" state
  const scan = await Scan.create({
    userId,
    mode,
    image: {
      path: file.path,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    },
    processingStatus: "pending",
  });

  try {
    // 2. Mark as processing
    scan.processingStatus = "processing";
    await scan.save();

    // 3. If document mode, run OCR first so the AI has text context
    let ocrResult = null;
    if (mode === "document") {
      ocrResult = await ocrService.extractText(file.path).catch((err) => {
        console.warn("[scanService] OCR failed, continuing without it:", err.message);
        return null;
      });
    }

    // 4. Analyze with AI
    const aiResult = await aiService.analyzeImage(file.path, mode);

    // 5. Merge OCR into result for document mode
    const mergedResult =
      mode === "document" && ocrResult
        ? { ...aiResult, extractedText: ocrResult.text, ocrConfidence: ocrResult.confidence }
        : aiResult;

    // 6. Persist
    scan.detectedItem = aiResult.detectedItem || "";
    scan.confidence = typeof aiResult.confidence === "number" ? aiResult.confidence : 0;
    scan.category = aiResult.category || "";
    scan.result = mergedResult;
    scan.processingStatus = "completed";
    scan.errorMessage = "";
    await scan.save();

    return scan;
  } catch (err) {
    scan.processingStatus = "failed";
    scan.errorMessage = err.message || "AI analysis failed";
    await scan.save();
    throw err;
  }
}

/**
 * Get a single scan, scoped to the user.
 */
async function getScan({ userId, scanId }) {
  const scan = await Scan.findOne({ _id: scanId, userId });
  if (!scan) throw new AppError("Scan not found", 404);
  return scan;
}

/**
 * List scans for a user with search, mode filtering, and pagination.
 */
async function listScans({ userId, mode, q, page = 1, limit = 10 }) {
  const filter = { userId };
  if (mode && VALID_MODES.includes(mode)) filter.mode = mode;
  if (q) {
    filter.$or = [
      { detectedItem: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }

  const skip = (Math.max(1, page) - 1) * Math.min(limit, 50);
  const effectiveLimit = Math.min(Math.max(1, limit), 50);

  const [scans, total] = await Promise.all([
    Scan.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(effectiveLimit)
      .lean(),
    Scan.countDocuments(filter),
  ]);

  return {
    scans,
    page: Math.max(1, page),
    limit: effectiveLimit,
    total,
    totalPages: Math.ceil(total / effectiveLimit) || 1,
  };
}

/**
 * Delete a scan and its uploaded image, scoped to the user.
 */
async function deleteScan({ userId, scanId }) {
  const scan = await Scan.findOneAndDelete({ _id: scanId, userId });
  if (!scan) throw new AppError("Scan not found", 404);

  // Best-effort removal of the uploaded file
  try {
    if (scan.image?.path && fs.existsSync(scan.image.path)) {
      fs.unlinkSync(scan.image.path);
    }
  } catch (err) {
    console.warn("[scanService] Could not delete uploaded file:", err.message);
  }
  return scan;
}

/**
 * Dashboard statistics for a user.
 */
async function dashboardStats(userId) {
  const [totalScans, recentScans, modeStats] = await Promise.all([
    Scan.countDocuments({ userId }),
    Scan.find({ userId }).sort({ createdAt: -1 }).limit(6).lean(),
    Scan.aggregate([
      { $match: { userId } },
      { $group: { _id: "$mode", count: { $sum: 1 } } },
    ]),
  ]);

  const modeStatistics = {
    product: 0,
    plant: 0,
    food: 0,
    electronics: 0,
    document: 0,
  };
  for (const row of modeStats) {
    if (modeStatistics[row._id] !== undefined) modeStatistics[row._id] = row.count;
  }
  const mostUsedMode =
    Object.entries(modeStatistics).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalScans,
    recentScans,
    mostUsedMode: mostUsedMode && modeStatistics[mostUsedMode] > 0 ? mostUsedMode : null,
    modeStatistics,
  };
}

module.exports = {
  createScan,
  getScan,
  listScans,
  deleteScan,
  dashboardStats,
  VALID_MODES,
};
