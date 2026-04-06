const Transaction = require("../models/Transaction");

// SUMMARY API
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0,
      expense = 0;

    result.forEach((item) => {
      if (item._id === "income") income = item.total;
      else expense = item.total;
    });

    res.json({
      success: true,
      income,
      expense,
      balance: income - expense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CATEGORY SUMMARY
exports.getCategorySummary = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};