const { expressjwt: jwt } = require("express-jwt");
const CoinModel = require("../Models/CoinModel");
const ExchangeModel = require("../Models/ExchangeModel");

const requireSign = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

// Add exchange coins for the logged-in user
const addExchangeCoins = async (req, res) => {
  try {
    const { Exchangecoins } = req.body; // The amount to be exchanged
    const userId = req.auth._id; // Assumes the user is authenticated with JWT

    // Validate the amount entered
    if (!Exchangecoins || Exchangecoins < 1000) {
      return res
        .status(400)
        .json({ message: "Exchangecoins must be at least 1000." });
    }

    // Fetch the user's coin balance from the Coin schema
    const userCoin = await CoinModel.findOne({ userId });

    if (!userCoin) {
      return res.status(404).json({ message: "User coin data not found." });
    }

    // Check if the user has enough coins in their account
    if (userCoin.coins < Exchangecoins) {
      return res
        .status(400)
        .json({ message: "Insufficient coins for withdrawal." });
    }

    // Deduct the coins from the Coin schema after exchange
    userCoin.coins -= Exchangecoins;
    await userCoin.save();

    // Create a new withdrawal record
    const newWithdrawal = new ExchangeModel({
      userId,
      Exchangecoins,
    });
    await newWithdrawal.save();

    res.status(200).json({
      message: "Coins exchanged successfully.",
      withdrawal: newWithdrawal, // Return the new withdrawal record
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all exchange data for the logged-in user
const getUserExchange = async (req, res) => {
  try {
    const userId = req.auth._id; // Assumes the user is authenticated with JWT

    // Fetch all exchange records for the logged-in user
    const exchanges = await ExchangeModel.find({ userId }).sort({
      createdAt: -1,
    });

    if (!exchanges || exchanges.length === 0) {
      return res.status(404).json({ message: "No exchange data found." });
    }

    res.status(200).json({
      message: "User exchange data retrieved successfully.",
      exchanges, // Return all withdrawal records
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  requireSign,
  addExchangeCoins,
  getUserExchange,
};
