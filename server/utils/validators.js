/**
 * Reusable validation rules for express-validator.
 */
const { body } = require("express-validator");

const VALID_MODES = ["product", "plant", "food", "electronics", "document"];

const registerRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is invalid")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

const chatRules = [
  body("scanId").notEmpty().withMessage("scanId is required").isMongoId().withMessage("Invalid scanId"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("message is required")
    .isLength({ max: 2000 })
    .withMessage("message too long"),
];

const feedbackRules = [
  body("scanId").notEmpty().withMessage("scanId is required").isMongoId().withMessage("Invalid scanId"),
  body("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),
  body("feedback")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("feedback must be at most 1000 characters"),
];

const settingsRules = [
  body("language")
    .optional()
    .isString()
    .isLength({ min: 2, max: 10 })
    .withMessage("language must be a short code"),
  body("defaultMode")
    .optional()
    .isIn(VALID_MODES)
    .withMessage("defaultMode must be one of " + VALID_MODES.join(", ")),
  body("notifications").optional().isBoolean().withMessage("notifications must be a boolean"),
];

const profileRules = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),
];

module.exports = {
  registerRules,
  loginRules,
  chatRules,
  feedbackRules,
  settingsRules,
  profileRules,
  VALID_MODES,
};
