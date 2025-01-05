const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
      `Connection Successfully with database    ${conn.connection.host}`
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
