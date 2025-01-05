const UserModel = require("../models/UserModel");
const { HashPassword, ComparePassword } = require("./../Helper/UserHelper");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");

var { expressjwt: jwt } = require("express-jwt");
const PurchaseModel = require("../Models/PurchaseModel");

const requireSign = [
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }),
  (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Invalid or missing token" });
    }
    next();
  },
];

// Function to generate a unique referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

const generateReferralLink = (referralCode) => {
  const baseUrl = "https://earn-tube.online"; // Replace with your actual base URL
  return `${baseUrl}/login?referralCode=${referralCode}`;
};
//login controller
const loginController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username && !email) {
      return res.status(400).send({
        success: false,
        message: "Username or email is required",
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required",
      });
    }

    // Find user by username or email
    const user = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const match = await ComparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Create token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
//register controller
const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;

    if (!usernameRegex.test(username)) {
      return res.status(400).send({
        success: false,
        message: "Username must contain at least one letter and one number",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "Username or email already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await HashPassword(password);

    // Generate referral code
    const newReferralCode = crypto.randomBytes(4).toString("hex");

    // Generate referral link
    const referralLink = generateReferralLink(newReferralCode);

    // Register new user
    const userRegister = new UserModel({
      username,

      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referralLink,
      accountStatus: "active",
    });

    // Handle referral
    if (referralCode) {
      const referringUser = await UserModel.findOne({ referralCode });
      if (referringUser) {
        referringUser.totelreffered = (referringUser.totelreffered || 0) + 1; // Increment total referred
        await referringUser.save();

        // Store the referral in the new user's data
        userRegister.referredBy = referralCode;
      }
    }

    await userRegister.save();
    const totalUsers = await UserModel.countDocuments();

    res.status(201).send({
      success: true,
      total: totalUsers,
      message: "User registered successfully",
      user: userRegister,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//update profile
const ProfileController = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;

    // Ensure email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle password update if provided
    if (currentPassword || newPassword) {
      // Check if current password matches
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required for password update",
        });
      }

      const match = await ComparePassword(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Validate new password length
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 8 characters long",
        });
      }

      // Hash the new password
      const hashedPassword = password
        ? await HashPassword(password)
        : undefined;

      // Update the user's password
      user.password = hashedPassword;
    }

    // Update user profile
    user.username = username || user.username;
    user.email = email || user.email;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "User already exist updating profile",
      error: error.message,
    });
  }
};

//get earning

const getEarningSlug = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Log the decoded token

    const userId = decoded._id;

    // Proceed with your existing logic
    const user = await UserModel.findById(userId).select(
      "username role TotalEarnings earnings CommissionAmount referralLink"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      username: user.username,
      role: user.role,
      TotalEarnings: user.TotalEarnings,
      earnings: user.earnings,
      CommissionAmount: user.CommissionAmount,
    });
  } catch (error) {
    console.error("Error fetching user earnings:", error);
    res.status(500).json({ error: "Server error" });
  }
};
//get refferal link
const getRefferallinkCodeController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Log the decoded token

    const userId = decoded._id;

    // Proceed with your existing logic
    const user = await UserModel.findById(userId).select("referralLink");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      referralLink: user.referralLink,
    });
  } catch (error) {
    console.error("Error fetching user earnings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

//get total refferal
//total refferal

const getTotalReferrals = async (req, res) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Extract user ID from the decoded token
    const userId = decoded._id;

    // Find the user based on user ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find all users who have registered with this user's referral code
    const referredUsers = await UserModel.find({
      referredBy: user.referralCode,
    });

    if (referredUsers.length === 0) {
      return res.status(200).json({
        totalReferrals: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        referralDetails: [],
      });
    }

    // Extract IDs of all referred users
    const referredUserIds = referredUsers.map((u) => u._id);

    // Fetch package purchase details for all referred users in one query
    const packagePurchases = await PurchaseModel.find({
      userId: { $in: referredUserIds },
    }).populate("packagesId", "name packageStatus");

    // Create a map of userId to their package purchase details
    const purchaseMap = packagePurchases.reduce((acc, purchase) => {
      acc[purchase.userId] = purchase;
      return acc;
    }, {});

    // Prepare referral details with relevant package purchase information
    const referralDetails = referredUsers.map((referredUser) => {
      const packagePurchase = purchaseMap[referredUser._id];
      return {
        username: referredUser.username,
        email: referredUser.email,
        packageName: packagePurchase ? packagePurchase.packagesId.name : null,
        packageStatus: packagePurchase ? packagePurchase.packageStatus : null,
      };
    });

    // Calculate active and inactive counts
    const activeCount = referralDetails.filter(
      (referral) => referral.packageStatus === "Active"
    ).length;
    const inactiveCount = referralDetails.length - activeCount;

    res.status(200).json({
      totalReferrals: referralDetails.length,
      activeUsers: activeCount,
      inactiveUsers: inactiveCount,
      referralDetails,
    });
  } catch (error) {
    console.error("Error fetching total referrals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  requireSign,
  loginController,
  registerController,
  ProfileController,
  getEarningSlug,
  getRefferallinkCodeController,
  getTotalReferrals,
};
