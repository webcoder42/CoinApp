const express = require("express");
const {
  getUserCoins,
  addCoin,
  requireSign,
  getAllUsersWithCoins,
} = require("../Controller/CoinController");
const router = express.Router();

// Get user's coin data
router.get("/get", requireSign, getUserCoins);
// Get all user's coin data

router.get("/get-all", requireSign, getAllUsersWithCoins);

// Add coin on tap
router.post("/add", requireSign, addCoin);

module.exports = router;
