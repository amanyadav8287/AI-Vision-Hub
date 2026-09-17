const express = require("express");
const scanController = require("../controllers/scanController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { AppError } = require("../middleware/errorMiddleware");
const { VALID_MODES } = require("../utils/validators");

const router = express.Router();

// Validate the `mode` field before handing to controller.
function validateMode(req, _res, next) {
  if (!req.body.mode || !VALID_MODES.includes(req.body.mode)) {
    return next(new AppError(`mode must be one of: ${VALID_MODES.join(", ")}`, 400));
  }
  if (!req.file) {
    return next(new AppError("image is required", 400));
  }
  next();
}

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validateMode,
  scanController.createScan
);

router.get("/", authMiddleware, scanController.listScans);
router.get("/:id", authMiddleware, scanController.getScan);
router.delete("/:id", authMiddleware, scanController.deleteScan);

module.exports = router;
