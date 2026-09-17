const express = require("express");
const feedbackController = require("../controllers/feedbackController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { feedbackRules } = require("../utils/validators");

const router = express.Router();

router.post("/", authMiddleware, feedbackRules, validate, feedbackController.submit);

module.exports = router;
