const express = require("express");
const {
  requireSign,
  getAllPackageController,
  singlePackageController,
} = require("../Controller/PackageController");

const router = express.Router();

//get all package
router.get("/all-package", requireSign, getAllPackageController);

// Get single package by slug
router.get("/single-package/:slug", requireSign, singlePackageController);

module.exports = router;
