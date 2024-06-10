const { Job } = require("../module/job.model.js");
const { errorhandler } = require("../utils/error.js");

async function getAllJobs(req, res, next) {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
}

async function postJob(req, res, next) {
  const { Role } = req.User;
  console.log(Role);
  if (Role === "Job Seeker") {
    return next(
      errorhandler(401, "Job Seeker not allowed to access this resource.")
    );
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    expired,
  } = req.body;

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return errorhandler(
      400,
      "Please either provide fixed salary or ranged salary."
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return errorhandler(400, "Cannot Enter Fixed and Ranged Salary together.");
  }
  console.log(req.User);
  const postedBy = req.User;
  console.log(postedBy);
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
}

async function getMyJobs(req, res, next) {
  const { Role } = req.User;
  if (Role === "Job Seeker") {
    return next(
      new errorhandler(400, "Job Seeker not allowed to access this resource.")
    );
  }
  const myJobs = await Job.find({ postedBy: req.User._id });
  res.status(200).json({
    success: true,
    myJobs,
  });
}

async function updateJob(req, res, next) {
  const { Role } = req.User;
  if (Role === "Job Seeker") {
    return errorhandler(400, "Job Seeker not allowed to access this resource.");
  }
  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return errorhandler(404, "OOPS! Job not found.");
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
}

async function deleteJob(req, res, next) {
  const { Role } = req.User;
  if (Role === "Job Seeker") {
    return errorhandler(400, "Job Seeker not allowed to access this resource.");
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return errorhandler(404, "OOPS! Job not found.");
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
}

async function getSingleJob(req, res, next) {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return errorhandler(404, "Job not found.");
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return errorhandler(404, "Invalid ID");
  }
}

module.exports = {
  getAllJobs,
  postJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getSingleJob,
};
