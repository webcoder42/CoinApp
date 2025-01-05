const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: false,
    },
    notification: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", NotificationSchema);
