const express = require("express");
const jwt = require("jsonwebtoken");

const Expense = require("../models/Expense");

const router = express.Router();


// AUTH MIDDLEWARE
function auth(req, res, next) {

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No token",
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token",
    });
  }
}


// ADD EXPENSE
router.post("/", auth, async (req, res) => {

  try {

    const { title, amount, category, date } = req.body;
    
    const expenseData = {
      title: title || category,
      amount,
      category,
      userId: req.userId,
    };
    
    if (date) {
      expenseData.date = date;
    }

    const expense = await Expense.create(expenseData);

    res.status(201).json(expense);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// GET EXPENSES
router.get("/", auth, async (req, res) => {

  try {

    const expenses = await Expense.find({
      userId: req.userId,
    });

    res.json(expenses);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});


// DELETE EXPENSE
router.delete("/:id", auth, async (req, res) => {

  try {

    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      message: "Expense deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});
// UPDATE EXPENSE
router.put("/:id", auth, async (req, res) => {

  try {

    const { title, amount, category, date } = req.body;

    const updatedExpense =
      await Expense.findByIdAndUpdate(
        req.params.id,
        {
          title,
          amount,
          category,
          date,
        },
        { new: true }
      );

    res.json(updatedExpense);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;