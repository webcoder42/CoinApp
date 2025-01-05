var { expressjwt: jwt } = require("express-jwt");
const PackageModel = require("../Models/PackageModel");

const requireSign = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
//get all
const getAllPackageController = async (req, res) => {
  try {
    const packages = await PackageModel.find({});
    res.status(200).send({
      success: true,
      totalPackages: packages.length,
      message: "All packages list",
      packages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in getting packages",
    });
  }
};

//get single
const singlePackageController = async (req, res) => {
  try {
    const { slug } = req.params;
    const getPackage = await PackageModel.findOne({ slug });

    if (!getPackage) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Get single package",
      getPackage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in getting single package",
    });
  }
};

module.exports = {
  requireSign,
  getAllPackageController,
  singlePackageController,
};
