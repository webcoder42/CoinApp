var { expressjwt: jwt } = require("express-jwt");
const UserContactModel = require("../Models/UserContactModel");

const requireSign = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const getContact = async (req, res) => {
  try {
    const Contact = await UserContactModel.find({});
    res
      .status(200)
      .json({ success: true, TotalContact: Contact.length, Contact });
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
  getContact,
};
