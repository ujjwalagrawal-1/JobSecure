const express = require("express");
const router = express.Router();
const {Signup,Signin,Forgotpassword,Resetpassword,Resetedpassword,getUser} = require("../controllers/user.controller")
const validate = require("../Middleware/validate.schema")
const {RegisterSchema,SigninSchema,ForgotpasswordSchema} = require("../validation/zodschema")
const {Logout}  = require("../controllers/user.controller")
const {AuthMiddleware} = require("../Middleware/Auth.Middleware")

router.post("/signup",validate(RegisterSchema),Signup);
router.post("/signin",Signin);
router.post("/ForgotPassword",validate(ForgotpasswordSchema),Forgotpassword);
router.get("/ResetPassword/:token/:_id",Resetpassword);
router.post("/ResetPassword/:token/:_id",Resetedpassword);
router.get("/logout",AuthMiddleware,Logout);
router.get("/getuser", AuthMiddleware, getUser);
module.exports = router