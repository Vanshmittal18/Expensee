const express = require("express");
const router = express.Router();

const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
} = require("../controllers/incomeController");

const { protect, authorize } = require("../middleware/authMiddleware");

// CREATE → ADMIN
router.post("/", protect, authorize("admin"), addIncome);

// READ → ALL
router.get("/", protect, authorize("viewer", "analyst", "admin"), getAllIncome);

// DELETE → ADMIN
router.delete("/:id", protect, authorize("admin"), deleteIncome);

// DOWNLOAD → ANALYST + ADMIN
router.get("/download", protect, authorize("analyst", "admin"), downloadIncomeExcel);

module.exports = router;