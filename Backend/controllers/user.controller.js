const { errorhandler } = require("../utils/error");
const { User } = require("../module/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcrypt");
const { sendToken } = require("../utils/jwttokens");
async function Signup(req, res) {
    const body = req.body;
    if (!body) {
        res.status(400).json(errorhandler(400, "Request body is missing"));
        return;
    }
    if(body.Password !== body.ConfirmPassword){
        res.status(403).json({
            msg : "Confirm Password and Password do not matched"
        })
        return;
    }
    console.log(body);
    try {
        const existingUser = await User.findOne({
            $or: [
                { Username: body.Username },
                { Email: body.Email }
            ]
        });

        if (existingUser) {
            res.status(401).json(errorhandler(401, "User is already registered"));
            return;
        }

        // Create new user
        const dbUser = new User(body);
        await dbUser.save();
        // Generate auth token and user response
        const token = dbUser.generateAuthToken();
        sendToken(token, 201, res, "User registered successfully", dbUser.getUserData());
    } catch (error) {
        console.error(error);
        res.status(500).json(errorhandler(500, "Internal Server Error during registering the User "));
    }
}

// Signin function
async function Signin(req, res,next) {
    const body = req.body;
    console.log(body);
    if (!body) {
        res.status(400).json(errorhandler(400, "Request body is missing"));
        return;
    }

    try {
        const dbUser = await User.findOne({
            $or: [
                { Username: body.Username },
                { Email: body.Email }
            ]
        });

        if (!dbUser) {
            res.status(401).json(errorhandler(401, "User not registered"));
            return;
        }

        // Check if password matches
        const isMatch = await dbUser.isPasswordCorrect(body.Password);
        if (!isMatch) {
            res.status(401).json(errorhandler(401, "Password is incorrect, please relogin"));
            return;
        }
        if(body.Role !== dbUser.Role){
            return res.status(401).json({
                message : "Please Provide the  Coorect Role"
            });
        }
        const token = dbUser.generateAuthToken();
        sendToken(token, 201, res, "User Signedin successfully", dbUser.getUserData());
    } catch (error) {
        console.error(error);
        res.status(500).json(errorhandler(500, "Internal Server Error While Signin"));
    }
}
async function Logout(req, res, next) {
    try{
        res
    .status(200)  // Changed status code to 200 OK
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),  // Set expiration date to a time in the past
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
    }
    catch(error){
        res.status(420,"User Not logout")
    }
    
}

async function Forgotpassword(req,res){
    const data = req.body;
    const em = data.Email;
    console.log(em);
    const olduser = await User.findOne({Email : em});
    if(!olduser){
        res.status(403).json({
            msg : "This  Email is Not registerd to the Database"
        });
        return;
    }
    const secret = config.TOKEN_SECRET + olduser.Password;
    const token = jwt.sign({
        Email : olduser.Email,
    },secret,{expiresIn : "10M"});
    const link = `${config.FRONTEND_URL}/api/v1/user/ResetPassword/${token}/${olduser._id}`;
    console.log(link);
    res.status(200).json({
        msg : "got link",
        link : link
    })
}
async function Resetpassword(req,res){
    try {
        const { token, _id } = req.params;
        const olduser = await User.findById(_id);
        if (!olduser) {
            return res.status(403).json({
                msg: "You are not the right user"
            });
        }
        
        const secret = config.TOKEN_SECRET + olduser.Password;
        try {
            const verify = jwt.verify(token, secret);
            if(!verify){
                res.status(403).json({msg : "Noefewfewfds"});
            }
            // You can render a page here or return a success message
            res.render("index",{Email : verify.Email})
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                msg: "Not verified!"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }

}
async function Resetedpassword(req, res) {
    try {
        const { token, _id } = req.params;
        const { password } = req.body;

        // Validate password (basic example)
        if (!password || password.length < 6) {
            return res.status(400).json({
                msg: "Password must be at least 6 characters long"
            });
        }

        const olduser = await User.findById(_id);
        if (!olduser) {
            return res.status(403).json({
                msg: "You are not the right user"
            });
        }

        const secret = config.TOKEN_SECRET + olduser.Password;
        console.log(`Your New Password is  -> ${password}`)
        const hasedpassword = await bcrypt.hash(password, 10);
        try {
            jwt.verify(token, secret);
        } catch (error) {
            return res.status(401).json({
                msg: "Not verified!"
            });
        }

        // Hash the new password before saving

        await User.updateOne({ _id }, { $set: { Password: hasedpassword } });

        return res.status(200).json({
            msg: "Password has been successfully reset"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Internal server error"
        });
    }
}
async function getUser(req,res,next){
    try {
        const User = req.User;

        res.status(200).json({
            Success : true,
            User
        })
    } catch (error) {
        return errorhandler(402,"Can't fetch the data")
    }
}

module.exports = {
    Signup,
    Signin,
    Forgotpassword,
    Resetpassword,Resetedpassword,Logout,getUser
};
