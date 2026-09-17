const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, favoriteController.list);
router.post("/:scanId", authMiddleware, favoriteController.add);
router.delete("/:scanId", authMiddleware, favoriteController.remove);

module.exports = router;
