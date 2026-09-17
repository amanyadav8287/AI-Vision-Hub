const express = require("express");
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { chatRules } = require("../utils/validators");

const router = express.Router();

router.post("/", authMiddleware, chatRules, validate, chatController.ask);
router.get("/:scanId", authMiddleware, chatController.history);

module.exports = router;
