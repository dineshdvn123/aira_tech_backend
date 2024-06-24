// models/job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  JobId: {
    type: String,
    required: true
  },
  RoleName: {
    type: String,
    required: true
  },
  RoleCategory: {
    type: String,
    required: true
  },
  CompanyName: {
    type: String,
    required: true
  },
  WorkEnv: {
    type: String,
    required: true
  },
  State: {
    type: String,
    required: true
  },
  Country: {
    type: String,
    required: true
  },
  City: {
    type: String,
    required: true
  },
  SalaryRange: {
    type: String,
    required: true
  },
  JobDescription: {
    type: String,
    required: true
  },
  ExperienceRequired: {
    type: String,
    required: true
  },
  JobType: {
    type: String,
    required: true
  },
  PostedDate: {
    type: Date,
    required: true
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
