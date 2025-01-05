const express = require("express");
const {
  getNotify,
  requireSign,
} = require("../Controller/NotificationController");

const router = express.Router();

//get notification
router.get("/get-notify", requireSign, getNotify);

module.exports = router;
