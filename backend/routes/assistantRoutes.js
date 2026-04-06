const express = require("express");
const {getResponseFromGPT} = require("../controllers/assistantController");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

// router.post("/askGPT", getResponseFromGPT);
router.post("/askGPT", protect, getResponseFromGPT);

module.exports = router;
