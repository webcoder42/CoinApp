var { expressjwt: jwt } = require("express-jwt");
const CoinModel = require("../Models/CoinModel");
const PurchaseModel = require("../Models/PurchaseModel");
const UserModel = require("../models/UserModel");

// Middleware for requiring a signed-in user
const requireSign = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth", // Adds the user data to req.auth
});

// Controller to get the logged-in user's coin data
const getUserCoins = async (req, res) => {
  try {
    const userId = req.auth._id; // Retrieve the user ID from the token

    // Fetch user's coin data from the database
    const userCoins = await CoinModel.findOne({ userId });

    if (!userCoins) {
      return res
        .status(404)
        .json({ message: "Coin data not found for this user" });
    }

    res.status(200).json(userCoins);
  } catch (error) {
    console.error("Error fetching user coins:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to add a coin for the logged-in user
const addCoin = async (req, res) => {
  try {
    const userId = req.auth._id; // Retrieve the user ID from the token
    const { x, y } = req.body; // Tap position coordinates

    const activePurchase = await PurchaseModel.findOne({
      userId,
      packageStatus: "Active",
    });
    if (!activePurchase) {
      return res
        .status(400)
        .json({ message: "No active package found for the user." });
    }
    // Validate that coordinates are provided
    if (x === undefined || y === undefined) {
      return res
        .status(400)
        .json({ message: "Tap coordinates (x, y) are required" });
    }

    // Find the user's coin data or create a new record if none exists
    let userCoinData = await CoinModel.findOne({ userId });
    if (!userCoinData) {
      userCoinData = new CoinModel({ userId, coins: 0, taps: [] });
    }

    // Increment the coin count and log the tap position
    userCoinData.coins += 1;
    userCoinData.taps.push({ x, y });

    // Save the updated coin data to the database
    await userCoinData.save();

    res.status(200).json({
      message: "Coin added successfully",
      coins: userCoinData.coins,
      taps: userCoinData.taps,
    });
  } catch (error) {
    console.error("Error adding coin:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller to get all users with their coin data
const getAllUsersWithCoins = async (req, res) => {
  try {
    // Aggregate query to join CoinModel with UserModel
    const usersWithCoins = await CoinModel.aggregate([
      {
        $lookup: {
          from: "users", // UserModel collection name (should match actual MongoDB collection name)
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails", // Unwind the userDetails array
      },
      {
        $project: {
          _id: 0, // Exclude CoinModel _id
          email: "$userDetails.email", // Include email from UserModel
          coins: 1, // Include coins from CoinModel
        },
      },
    ]);

    if (!usersWithCoins || usersWithCoins.length === 0) {
      return res.status(404).json({ message: "No users with coins found" });
    }

    res.status(200).json(usersWithCoins);
  } catch (error) {
    console.error("Error fetching users with coins:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  requireSign,
  getAllUsersWithCoins,
  getUserCoins,
  addCoin,
};
