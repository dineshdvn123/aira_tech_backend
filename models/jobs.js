const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  JobId: { type: Number, required: true, unique: true },
  RoleName: { type: String, required: true },
  RoleCategory: { type: String, required: true },
  CompanyName: { type: String, required: true },
  WorkEnv: { type: String, required: true },
  State: { type: String, required: true },
  Country: { type: String, required: true },
  City: { type: String, required: true },
  SalaryLow: { type: Number, required: true },
  SalaryHigh: { type: Number, required: true },
  CompanyDescription: { type: String, required: true },
  Responsibilities: { type: String, required: true },
  Qualifications: { type: String, required: true },
  Benefits: { type: String, required: true },
  ExperienceRequired: { type: String, required: true },
  JobType: { type: String, required: true },
  PostedDate: { type: Date, required: true },
  Status: { type: String, required: true, enum: ['Open', 'Closed', 'OnHold'], default: 'Open' },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }]
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
