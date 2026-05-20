const express = require("express");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// GET profile
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST / UPDATE profile (upsert — creates if not exists, updates if exists)
router.post("/", auth, async (req, res) => {
  try {
    const { name, phone, age, income, goal, dailyLimit } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      { name, phone, age, income, goal, dailyLimit, userId: req.userId },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
