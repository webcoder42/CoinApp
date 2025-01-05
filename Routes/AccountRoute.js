const express = require("express");
const {
  createAccount,
  getAllAccounts,
  getAccount,

  requireSign,
  updateAccount,
} = require("../Controller/AccountController");

const router = express.Router();

// POST: Create a new account
router.post("/user-submit", requireSign, createAccount);

// GET: Get all accounts
router.get("/get", requireSign, getAllAccounts);

// GET: Get account by ID
router.get("/getuser", requireSign, getAccount);

// update: Get accounts for the logged-in user
router.put("/accountupdate", requireSign, updateAccount);

module.exports = router;
