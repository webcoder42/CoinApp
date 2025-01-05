const express = require("express");
const {
  getUserMembershipController,
  getAllTransactionController,
  packagePurchaseController,
  requireSign,
} = require("../Controller/PurchaseController");

const router = express.Router();
// Purchase package route
router.post("/purchasepackage", requireSign, packagePurchaseController);

//get all transaction
router.get("/get-all-tarnsaction", requireSign, getAllTransactionController);

//get single ho kar raha ha na
router.get("/membership", requireSign, getUserMembershipController);

module.exports = router;
