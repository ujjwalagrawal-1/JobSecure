const mongoose = require("mongoose");
const ConnectDB = async (URL,DBNAME) => {
    try{
        await mongoose.connect(`${URL}/${DBNAME}`);
        console.log("MongoDB Connected")
    }
    catch(err){
        res.status(404).json({
            msg : "MongoDB Not Connected Successfully"
        });
        console.log('Failed to Connect to the MongoDb Please onecs Check the MongoDb Url you have connected ')
    }
};

module.exports = {ConnectDB};