const { checkJWTtoken } = require("../services/auth");

function checkForAuth(cookieName) {
  return (req, res, next) => {
    const myCookie = req.cookies[cookieName];
    if (!myCookie) {
      return next();
    }
    try {
      const userPayload = checkJWTtoken(myCookie);
      req.user = userPayload;
    } catch (error) {
    }
    next();
  }
}

module.exports = {
  checkForAuth,
}
