const express = require("express");
const router = express.Router();

const {
  getSummary,
  getCategorySummary,
} = require("../controllers/summaryController");

const { protect, authorize } = require("../middlewares/authMiddleware");

// ANALYST + ADMIN
router.get("/", protect, authorize("analyst", "admin"), getSummary);
router.get("/category", protect, authorize("analyst", "admin"), getCategorySummary);

module.exports = router;