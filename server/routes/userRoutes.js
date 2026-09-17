const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const { settingsRules, profileRules } = require("../utils/validators");

const router = express.Router();

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, profileRules, validate, userController.updateProfile);

router.get("/settings", authMiddleware, userController.getSettings);
router.put("/settings", authMiddleware, settingsRules, validate, userController.updateSettings);

router.get("/dashboard", authMiddleware, userController.dashboard);

module.exports = router;
