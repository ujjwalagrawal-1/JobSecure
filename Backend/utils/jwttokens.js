const config = require("../config/config");

const sendToken = (token, statusCode, res, message) => {
    const cookieOptions = {
        expires: new Date(
            Date.now() + config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true
    };
  
    res.status(statusCode).cookie("token", token, cookieOptions).json({
        success: true,
        message,
        // token
    });
};

module.exports = {
    sendToken
};
