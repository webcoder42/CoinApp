const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(v);
        },
        message: (props) =>
          `${props.value} must contain at least one letter and one number.`,
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "PKR"],
    },
    role: {
      type: Number,

      default: "0",
    },
    TotalEarnings: {
      type: Number,
      default: 0,
    },
    earnings: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true, // Referral code should be unique but not required
      default: null, // Default to null if not provided
    },
    referralLink: {
      type: String,
      unique: true, // Referral code should be unique but not required
      default: null,
    },
    referredBy: {
      type: String,
      default: null, // Default to null if not referred by anyone
    },
    totelreffered: {
      type: Number,
      default: 0,
    },

    packageActivationStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "Completed",
        "Active",
        "cancel",
        "Expired",
        null,
      ],
      default: null,
    },
    CommissionAmount: {
      type: Number,
      default: 0,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
