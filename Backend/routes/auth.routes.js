const express = require("express");
const router = express.Router();
const userrouter = require("./user.routes")
const jobrouter = require("./job.routes")
const applicationrouter = require("./application.routes")
// rOUTE

router.use("/user",userrouter); 
router.use("/job", jobrouter)
router.use("/application",applicationrouter);
// router.use("/job",jobrouter);
// router.use("/application",applicationrouter);
module.exports = router;
