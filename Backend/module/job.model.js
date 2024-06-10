const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, 
  },
  category: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  fixedSalary: {
    type: Number,
    min: 1000,
    max: 999999999,
  },
  salaryFrom: {
    type: Number,
    min: 1000, // 4 digits
    max: 999999999, // 9 digits
  },
  salaryTo: {
    type: Number,
    min: 1000, // 4 digits
    max: 999999999, // 9 digits
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
}, {timestamps: true});

const Job = mongoose.model("Job", JobSchema);

module.exports = { Job };
