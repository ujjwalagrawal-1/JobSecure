const express = require("express");
const router = express.Router();
const { getAllJobs, postJob, getMyJobs, updateJob, deleteJob, getSingleJob } = require("../controllers/job.controller");
const { AuthMiddleware } = require("../Middleware/Auth.Middleware");
const validate = require("../Middleware/validate.schema");
const { jobSchema } = require("../validation/zodschema");

router.get("/getall", getAllJobs);
router.post("/post",AuthMiddleware,postJob);
router.get("/getmyjobs", AuthMiddleware, getMyJobs);
router.put("/update/:id", AuthMiddleware, updateJob);
router.delete("/delete/:id", AuthMiddleware, deleteJob);
router.get("/:id", AuthMiddleware, getSingleJob);

module.exports = router;
