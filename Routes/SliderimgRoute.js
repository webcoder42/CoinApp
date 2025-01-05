const express = require("express");
const {
  requireSign,
  imagegetController,
} = require("../Controller/SliderImgController");

const router = express.Router();

router.get("/get-all-image", requireSign, imagegetController);

module.exports = router;
