const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicantSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: String, required: true }, // Store URL or file path here
  JobId: { type: Number, required: true },
});

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;
