const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  age: { type: String, default: "" },
  income: { type: Number, default: 0 },
  goal: { type: Number, default: 0 },
  dailyLimit: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
