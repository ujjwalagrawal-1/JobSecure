const config = require("./config/config")
const express = require("express");
const {ConnectDB} = require("./db/db")
const cors = require("cors")
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
// File Upload
cloudinary.v2.config({
    cloud_name : config.CLOUDINARY_CLOUD_NAME,
    api_key : config.CLOUDINARY_CLOUD_API,
    api_secret : config.CLOUDINARY_CLOUD_SECRET
})


function Connecttoserver(){
    const app = express();
    ConnectDB(config.DB_URI,config.DB_NAME);
    app.use(cors({
        origin : [`${config.FRONTEND_URL}`],
        methods : ["GET", "POST","PUT","DELETE","PATCH" , "HEAD"],
        credentials : true,
    }))
    app.use(express.json());
    app.set("view engine", "ejs")
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : "/tmp/",
        }))
        
    app.use(cookieParser());
    
    const Mainrouter = require("./routes/auth.routes");
    app.use("/api/v1",Mainrouter);
    app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
          success: false,
          message: err.message || "Internal Server Error",
        });
      });
    app.listen(config.PORT,() => {
        console.log(`listening on port ${config.PORT}`)
    })
}

Connecttoserver();