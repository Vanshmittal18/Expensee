const express = require("express");
const router = express.Router();

const { getSummary } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("analyst", "admin"), getSummary);

module.exports = router;