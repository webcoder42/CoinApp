const express = require("express");

const {
  loginController,
  registerController,
  ProfileController,
  requireSign,
  getEarningSlug,
  getRefferallinkCodeController,
  getTotalReferrals,
} = require("../Controller/UserController");

const router = express.Router();

//Registration route
router.post("/register", registerController);

//Login Route
router.post("/login", loginController);

//updatee profile
router.put("/update-profile", requireSign, ProfileController);

//total single user earning earning
router.get("/earnings", requireSign, getEarningSlug);

//get
router.get("/get-refferallink", requireSign, getRefferallinkCodeController);

//get all refferal
// Route to get total referrals for a user
router.get("/total-referrals", requireSign, getTotalReferrals);

module.exports = router;
