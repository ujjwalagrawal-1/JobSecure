const express = require("express");
const router = express.Router();
const { employerGetAllApplications, jobseekerDeleteApplication, jobseekerGetAllApplications, postApplication } = require("../controllers/Application.Controller.js");
const { AuthMiddleware } = require("../Middleware/Auth.Middleware.js");
const validate = require("../Middleware/validate.schema.js");
const { ApplicationSchema } = require("../validation/zodschema.js");

router.post("/post", AuthMiddleware, postApplication);
router.get("/employer/getall", AuthMiddleware, employerGetAllApplications);
router.get("/jobseeker/getall", AuthMiddleware, jobseekerGetAllApplications);
router.delete("/delete/:id", AuthMiddleware, jobseekerDeleteApplication);

module.exports = router;
