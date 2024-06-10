const { Job } = require("../module/job.model");
const { Application } = require("../module/jobapplication.model");
const cloudinary = require("cloudinary");
const { errorhandler } = require("../utils/error");
async function postApplication(req, res, next) {
  try {
    const { Role } = req.User;
    if (Role === "Employer") {
      return next(
        errorhandler(400, "Employer not allowed to access this resource.")
      );
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(errorhandler(400, "Resume File Required!"));
    }

    const { resume } = req.files;
    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedFormats.includes(resume.mimetype)) {
      return next(
        errorhandler(
          400,
          "Invalid file type. Please upload a PNG, JPEG, WEBP, or PDF file."
        )
      );
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(errorhandler(500, "Failed to upload Resume to Cloudinary"));
    }

    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantID = {
      User: req.User._id,
      Role: "Job Seeker",
    };

    if (!jobId) {
      return next(errorhandler(404, "Job not found!"));
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
      return next(errorhandler(404, "Job not found!"));
    }
    console.log(jobDetails);
    const employerID = {
      User: jobDetails.postedBy,
      Role: "Employer",
    };

    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    next(
      errorhandler(
        500,
        error.message || "An error occurred while submitting the application"
      )
    );
  }
}

async function employerGetAllApplications(req, res, next) {
  const { Role } = req.User;
  if (Role === "Job Seeker") {
    return next(
      errorhandler(400, "Job Seeker not allowed to access this resource.")
    );
  }
  const { _id } = req.User;
  const applications = await Application.find({ "employerID.User": _id });
  res.status(200).json({
    success: true,
    applications,
  });
}

async function jobseekerGetAllApplications(req, res, next) {
  const { Role } = req.User;
  if (Role === "Employer") {
    return errorhandler(400, "Employer not allowed to access this resource.");
  }
  const { _id } = req.User;
  const applications = await Application.find({ "applicantID.User": _id });
  res.status(200).json({
    success: true,
    applications,
  });
}

async function jobseekerDeleteApplication(req, res, next) {
  const { Role } = req.User;
  if (Role === "Employer") {
    return errorhandler(400, "Employer not allowed to access this resource.");
  }
  const { id } = req.params;
  const application = await Application.findById(id);
  if (!application) {
    return errorhandler(404, "Application not found!");
  }
  await application.deleteOne();
  res.status(200).json({
    success: true,
    message: "Application Deleted!",
  });
}

module.exports = {
  employerGetAllApplications,
  jobseekerDeleteApplication,
  jobseekerGetAllApplications,
  postApplication,
};
