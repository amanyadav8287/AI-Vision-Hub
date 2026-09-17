const scanService = require("../services/scanService");
const { success } = require("../utils/response");

/**
 * POST /api/scans
 * multipart/form-data with `image` and `mode`.
 */
async function createScan(req, res, next) {
  try {
    const scan = await scanService.createScan({
      userId: req.user._id,
      mode: req.body.mode,
      file: req.file,
    });

    return success(res, {
      statusCode: 201,
      message: "Scan completed successfully",
      data: scan,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/scans
 * Query: mode, q, page, limit
 */
async function listScans(req, res, next) {
  try {
    const { mode, q, page, limit } = req.query;
    const result = await scanService.listScans({
      userId: req.user._id,
      mode,
      q,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });

    return success(res, {
      message: "Scans retrieved",
      data: result.scans,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/scans/:id
 */
async function getScan(req, res, next) {
  try {
    const scan = await scanService.getScan({
      userId: req.user._id,
      scanId: req.params.id,
    });
    return success(res, { data: scan });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/scans/:id
 */
async function deleteScan(req, res, next) {
  try {
    await scanService.deleteScan({
      userId: req.user._id,
      scanId: req.params.id,
    });
    return success(res, { message: "Scan deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { createScan, listScans, getScan, deleteScan };
