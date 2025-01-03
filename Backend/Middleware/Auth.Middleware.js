const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { User } = require("../module/user.model");
const { errorhandler } = require("../utils/error");
const cookieParser = require("cookie-parser");

const AuthMiddleware = async function (req, res, next) {
  // Apply cookie-parser middleware to parse cookies
  const token  =  req.header("token") || req.cookies?.token ;

  if (!token) {
    return res.status(402).json({
      message : "Unauthorised User !!"
    });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, config.TOKEN_SECRET);
    // Find user by decoded user ID
    const user = await User.findById(decoded.UserId);
    user.Password = "";
    console.log("Hi there" ,user);
    req.User = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AuthMiddleware,
};
