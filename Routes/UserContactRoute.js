const express = require("express");
const {
  requireSign,
  getContact,
} = require("../Controller/UsrContactController");

const router = express.Router();

//get contact
router.get("/get-Contact", requireSign, getContact);

module.exports = router;
