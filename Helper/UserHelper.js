const bcrypt = require("bcrypt");

//Hash Password
const HashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const HashedPassword = await bcrypt.hash(password, saltRounds);
    return HashedPassword;
  } catch (error) {
    console.log(error);
  }
};

//commpare password

const ComparePassword = async (password, HashedPassword) => {
  return bcrypt.compare(password, HashedPassword);
};
module.exports = { HashPassword, ComparePassword };
