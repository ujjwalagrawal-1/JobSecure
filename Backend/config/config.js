
require("dotenv").config();

const config = {
  PORT: process.env.PORT,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  DB_URI: process.env.DB_URI,
  NODE_ENV: process.env.NODE_ENV,
  DB_NAME: process.env.DB_NAME,
  CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_CLOUD_SECRET : process.env.CLOUDINARY_CLOUD_SECRET,
  CLOUDINARY_CLOUD_API : process.env.CLOUDINARY_CLOUD_API,
  COOKIE_EXPIRE : process.env.COOKIE_EXPIRE,
  FRONTEND_URL : process.env.FRONTEND_URL
};

module.exports = config;
