// This file can be used to manage JWT settings, if needed
module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: "1h",
};
