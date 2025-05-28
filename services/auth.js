const jwt = require("jsonwebtoken");
require("dotenv").config;


function generateJWTtoken(user) {

  const jwtSecret = process.env.JWT_SECRET_KEY;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY not found");
  }
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  }

  const token = jwt.sign(payload, jwtSecret);
  return token;
}

function checkJWTtoken(token) {

  const jwtSecret = process.env.JWT_SECRET_KEY;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY not found");
  }

  const payload = jwt.verify(token, jwtSecret);
  return payload;
}

module.exports = {
  generateJWTtoken,
  checkJWTtoken,
}
