const { errorhandler } = require("../utils/error");
const { User } = require("../module/user.model");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcrypt");
async function Signup(req, res) {
    const body = req.body;
    if (!body) {
        res.status(400).json({message : "Request body is missing"});
        return;
    }
    if(body.Password !== body.ConfirmPassword){
        res.status(403).json({
            message : "Confirm Password and Password do not matched"
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
            res.status(401).json({message : "User is already registered"});
            return;
        }

        // Create new user
        const dbUser = new User(body);
        await dbUser.save();
        const token = dbUser.generateAuthToken();

        // sendToken(token, 201, res, "User registered successfully", dbUser.getUserData());
        const options = {
            httpOnly: true,
            secure: true, // Only secure in production
            sameSite: "None", // Required for cross-origin cookies
            expires: new Date(
                Date.now() + config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            )
        };
        body.Password = "";
        res.header("token", token)
      .status(200)
      .cookie("token", token, options)
      .json({
        message: "SignUp successful",
        token,
        body,
      });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Internal Server Error during registering the User "});
    }
}

// Signin function
async function Signin(req, res,next) {
    const body = req.body;
    console.log(body);
    if (!body) {
        res.status(400).json( { message  : "Request body is missing"});
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
            res.status(401).json({ message  : "User not registered"});
            return;
        }

        // Check if password matches
        const isMatch = await dbUser.isPasswordCorrect(body.Password);
        if (!isMatch) {
            res.status(401).json({message  : "Password is incorrect, please relogin" });
            return;
        }
        if(body.Role !== dbUser.Role){
            return res.status(401).json({
                message : "Please Provide the  Coorect Role"
            });
        }
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(
                Date.now() + config.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            )
        };
        const token = dbUser.generateAuthToken();
        dbUser.Password = "";
        res.header("token", token)
      .status(200)
      .cookie("token", token, options)
      .json({
        message: "Login successful",
        token,
        dbUser,
      });
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Internal Server Error While Signin"});
    }
}
async function Logout(req, res, next) {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };
    try{
        res.status(200)
    .cookie("token","",options)
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
    }
    catch(error){
        res.status(402).json({message : "User Not Logged Out"})
    }
}

async function Forgotpassword(req,res){
    const data = req.body;
    const em = data.Email;
    console.log(em);
    const olduser = await User.findOne({Email : em});
    if(!olduser){
        res.status(403).json({
            message : "This  Email is Not registerd to the Database"
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
                message: "You are not the right user"
            });
        }
        
        const secret = config.TOKEN_SECRET + olduser.Password;
        try {
            const verify = jwt.verify(token, secret);
            if(!verify){
                res.status(403).json({message : "Noefewfewfds"});
            }
            res.render("index",{Email : verify.Email})
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                message : "Not verified!"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message : "Internal server error"
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
                message: "Password must be at least 6 characters long"
            });
        }

        const olduser = await User.findById(_id);
        if (!olduser) {
            return res.status(403).json({
                message : "You are not the right user"
            });
        }

        const secret = config.TOKEN_SECRET + olduser.Password;
        console.log(`Your New Password is  -> ${password}`)
        const hasedpassword = await bcrypt.hash(password, 10);
        try {
            jwt.verify(token, secret);
        } catch (error) {
            return res.status(401).json({
                message: "Not verified!"
            });
        }

        // Hash the new password before saving

        await User.updateOne({ _id }, { $set: { Password: hasedpassword } });

        return res.status(200).json({
            message: "Password has been successfully reset"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
async function getUser(req,res,next){
    try {
        const user = req.User;
        console.log("rto" ,user);
        res.status(200).json({
            message : "Welcome!!",
            Success : true,
            user
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
