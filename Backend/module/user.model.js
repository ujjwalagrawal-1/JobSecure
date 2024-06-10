const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Ensure jwt is required
const config = require("../config/config");

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        minLength : 3,
        maxLength : 30,
    },
    Email: {
        type: String,
        required : true,
        unique : true
    },
    Password: {
        type: String,
        required: true,
        minLength: 6
    },
    Avator: {
        type: String,
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        minLength : 3, 
        maxLength: 50
    },
    lastname: {
        type: String,
        trim: true,
        maxLength: 50
    },
    Phone : {
        type : String,
        required : true,
        length : 10
    },
    Role : {
        type : String,
        enum : ["Job Seeker" , "Employer"],
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function(next) {
    try {
        if (!this.isModified("Password")) return next();

        this.Password = await bcrypt.hash(this.Password, 10);
        next();
    } catch (error) {
        console.log("Something went wrong with bcrypt password hashing");
        next(error);
    }
});

// Method to generate auth token
UserSchema.methods.generateAuthToken = function() {
    const payload = {
        UserId : this._id,
    };

    const token = jwt.sign(payload, config.TOKEN_SECRET, {
        expiresIn: "32d" // 1Mont expire time
    });
    return token;
};
// Method to get user data
UserSchema.methods.getUserData = function() {
    // console.log(this.lastname);
    return {
        name: this.firstname + ' '+ this.lastname,
        email: this.Email
    };
};

// Method to check if the password is correct
UserSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.Password);
};

const User = mongoose.model("User", UserSchema);

module.exports = {User};
