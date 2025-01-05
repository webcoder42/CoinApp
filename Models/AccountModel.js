const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Reference to the User model
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Easypaisa", "JazzCash", "UBL", "HBL", "Meezan Bank", "Other"],
    required: true, // Make it required
  },
  accountName: {
    type: String,
    required: true, // Account name is required
    trim: true, // Removes extra spaces
  },
  accountNumber: {
    type: String,
    required: true, // Account number is required
    unique: true, // Ensures no duplicate account numbers
    match: [/^\d+$/, "Account number must contain only digits"], // Validation for digits only
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation time
  },
});

module.exports = mongoose.model("Account", AccountSchema);
