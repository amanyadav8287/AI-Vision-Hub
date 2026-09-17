const mongoose = require("mongoose");
const multer = require("multer");
const { error } = require("../utils/response");

/**
 * Global error handling middleware.
 * Translates known error shapes into consistent JSON responses.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, _next) {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = null;

  // Mongoose validation
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose CastError (e.g. bad ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}`;
  }

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = 400;
      message = "File too large";
    } else if (err.code === "INVALID_FILE_TYPE") {
      statusCode = 400;
      message = "Unsupported file type. Allowed: JPG, PNG, WEBP.";
    } else {
      statusCode = 400;
      message = `Upload error: ${err.message}`;
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Unauthorized: invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Unauthorized: token expired";
  }

  // Operational custom errors (thrown from controllers)
  if (err.isOperational) {
    statusCode = err.statusCode || 400;
    message = err.message;
  }

  // Log server errors we didn't expect
  if (statusCode >= 500) {
    console.error("[error]", err);
    // Don't leak internal details to client
    message = "Internal server error";
  }

  const payload = { success: false, message };
  if (errors) payload.errors = errors;

  return res.status(statusCode).json(payload);
}

/**
 * 404 handler for unknown routes.
 */
function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Create a simple operational error.
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = { errorMiddleware, notFoundHandler, AppError };
