var { expressjwt: jwt } = require("express-jwt");
const AccountModel = require("../Models/AccountModel");
const { default: mongoose } = require("mongoose");

// Middleware for requiring a signed-in user
const requireSign = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth", // Adds the user data to req.auth
});
// Create a new account
const createAccount = async (req, res) => {
  try {
    const { accountType, accountName, accountNumber } = req.body;

    // Logged-in user's ID
    const userId = req.auth._id;

    // Check if user already has an account
    const existingAccount = await AccountModel.findOne({ userId });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message:
          "You already have an account. Duplicate accounts are not allowed.",
      });
    }

    // Create a new account if no existing account found
    const newAccount = new AccountModel({
      userId,
      accountType,
      accountName,
      accountNumber,
    });

    await newAccount.save();
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate account number
      return res
        .status(400)
        .json({ success: false, message: "Account number already exists" });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get all accounts
const getAllAccounts = async (req, res) => {
  try {
    const accounts = await AccountModel.find().populate("userId", "name email"); // Populate user details (name, email)
    return res
      .status(200)
      .json({ success: true, TotalAccount: accounts.length, data: accounts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Get account by ID
const getAccount = async (req, res) => {
  try {
    const userId = req.auth._id;

    const account = await AccountModel.findOne({ userId }).populate(
      "userId",
      "name email"
    );
    if (!account) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found" });
    }

    return res.status(200).json({ success: true, data: account });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update account by ID
const updateAccount = async (req, res) => {
  try {
    const userId = req.auth._id; // Extract user ID from the authenticated request
    const { accountType, accountName, accountNumber } = req.body;

    // Find the user's account
    const account = await AccountModel.findOne({ userId });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Update account fields
    if (accountType) account.accountType = accountType;
    if (accountName) account.accountName = accountName;
    if (accountNumber) account.accountNumber = accountNumber;

    await account.save(); // Save updated account
    return res.status(200).json({
      success: true,
      message: "Account updated successfully",
      data: account,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate account number
      return res
        .status(400)
        .json({ success: false, message: "Account number already exists" });
    }
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  requireSign,
  updateAccount,
  createAccount,
  getAllAccounts,
  getAccount,
};
