const express = require("express");
const {
  addExchangeCoins,
  getUserExchange,
  requireSign,
} = require("../Controller/ExchangeController");
const router = express.Router();

// Route for adding exchange coins
router.post("/exchange", requireSign, addExchangeCoins);

// Route for getting the logged-in user's exchange data
router.get("/getexchange", requireSign, getUserExchange);

module.exports = router;
