const mongoose = require("mongoose");

const PackagePurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    packagesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "packages",
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
    },
    sendernumber: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    packageStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "Completed",
        "Active",
        "cancel",
        "Expired",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", PackagePurchaseSchema);
