const SliderImgModel = require("../Models/SliderImgModel");
var { expressjwt: jwt } = require("express-jwt");

const requireSign = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

const imagegetController = async (req, res) => {
  try {
    // Fetch all images from the database
    const images = await SliderImgModel.find({});

    // Check if there are any images
    if (images.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No images found",
      });
    }

    // Map images to include base64 data with additional checks
    const formattedImages = images.map((img) => {
      if (img.photo && img.photo.data) {
        return {
          id: img._id,
          contentType: img.photo.contentType,
          data: img.photo.data.toString("base64"), // Convert binary data to base64 string
        };
      } else {
        return {
          id: img._id,
          contentType: null,
          data: null,
        };
      }
    });

    // Return the images to the frontend
    res.status(200).json({
      success: true,
      totalimage: formattedImages.length,
      message: "Images fetched successfully",
      data: formattedImages,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch images",
    });
  }
};

module.exports = {
  requireSign,
  imagegetController,
};
