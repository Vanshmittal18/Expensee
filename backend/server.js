const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes"); 

// ==============================
// CONFIG
// ==============================
dotenv.config();

// ==============================
// DATABASE CONNECTION
// ==============================
connectDB();

// ==============================
// INIT APP
// ==============================
const app = express();

// ==============================
// MIDDLEWARES
// ==============================
app.use(cors());
app.use(express.json()); // for parsing JSON
app.use(express.urlencoded({ extended: true })); // optional for form data

// ==============================
// ROUTES
// ==============================

// Auth Routes 
app.use("/api/v1/auth", authRoutes);

// Income Routes
app.use("/api/v1/income", incomeRoutes);

// Expense Routes
app.use("/api/v1/expense", expenseRoutes);

// Dashboard Summary Routes
app.use("/api/v1/dashboard", dashboardRoutes);

// ==============================
// ROOT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("ExpenseWise API is running...");
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ==============================
// SERVER LISTEN
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});