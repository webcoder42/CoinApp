var { expressjwt: jwt } = require("express-jwt");
const PackageModel = require("../Models/PackageModel");
const PurchaseModel = require("../Models/PurchaseModel");

const requireSign = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
const packagePurchaseController = async (req, res) => {
  const { transactionId, sendernumber, packagesId } = req.body;
  const userId = req.auth._id; // Change to req.auth._id

  if (!transactionId || !sendernumber) {
    return res.status(400).json({
      message: "Transaction ID, sender number, and  are required.",
    });
  }

  try {
    // Check if package exists
    const package = await PackageModel.findById(packagesId);
    if (!package) {
      return res.status(404).json({ message: "Package not found." });
    }

    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create a new purchase
    const newPurchase = new PurchaseModel({
      transactionId,
      senderNumber: sendernumber, // Update sendernumber correctly
      packageId: packagesId, // Update the package ID correctly
      userId,
      status: "pending",
    });

    await newPurchase.save();

    res.status(201).json({
      message: "Purchase created successfully.",
      purchase: newPurchase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const getAllTransactionController = () => {};

const getUserMembershipController = () => {};
module.exports = {
  requireSign,
  packagePurchaseController,
  getAllTransactionController,
  getUserMembershipController,
};
