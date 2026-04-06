const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  deleteExpense,
  downloadExpenseExcel,
} = require("../controllers/expenseController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ==============================
// EXPENSE ROUTES WITH ROLES
// ==============================

// CREATE → ADMIN ONLY
router.post("/", protect, authorize("admin"), addExpense);

// READ → ALL ROLES
router.get("/", protect, authorize("viewer", "analyst", "admin"), getAllExpenses);

// DELETE → ADMIN ONLY
router.delete("/:id", protect, authorize("admin"), deleteExpense);

// DOWNLOAD → ANALYST + ADMIN
router.get("/download", protect, authorize("analyst", "admin"), downloadExpenseExcel);

module.exports = router;