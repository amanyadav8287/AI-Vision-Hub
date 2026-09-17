const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const env = require("../config/env");

const UPLOAD_DIR = path.resolve(__dirname, "..", env.UPLOAD_DIR);

// Make sure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIMETYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    const ext = path.extname(file.originalname) || ".bin";
    cb(null, `${unique}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  console.log("[upload] filename:", file.originalname);
  console.log("[upload] mimetype:", file.mimetype);

  const ext = path.extname(file.originalname).toLowerCase();

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const validMimeType =
    ALLOWED_MIMETYPES.has(file.mimetype);

  const validExtension =
    allowedExtensions.includes(ext);

  if (!validMimeType && !validExtension) {
    cb(
      new multer.MulterError("INVALID_FILE_TYPE", "image")
    );
    return;
  }

  cb(null, true);
}

/**
 * Multer middleware configured from env.
 * Accepts a single field named "image".
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 1,
  },
});

module.exports = upload;
module.exports.UPLOAD_DIR = UPLOAD_DIR;
