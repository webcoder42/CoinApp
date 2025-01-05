var { expressjwt: jwt } = require("express-jwt");
const NotificationModel = require("../Models/NotificationModel");

const requireSign = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

//get notify
const getNotify = async (req, res) => {
  try {
    const announcements = await NotificationModel.find({});
    res.status(200).json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching announcements",
      error,
    });
  }
};

module.exports = {
  requireSign,
  getNotify,
};
