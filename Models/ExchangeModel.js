const mongoose = require("mongoose");

const ExchangeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    Exchangecoins: {
      type: Number,
      default: 10, // Default value is 1000 if not specified
      min: [10, "Exchangecoins must be at least 10"], // Validation to ensure minimum is 1000
      required: true, // Making it required so that the value can't be empty or undefined
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("exchange", ExchangeSchema);
