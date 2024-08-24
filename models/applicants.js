const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicantSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resumeUrl: { type: Schema.Types.ObjectId, ref: 'fs.files', required: true }, // Store GridFS file ID
  JobId: { type: Number, required: true },
});

const Applicant = mongoose.model('Applicant', applicantSchema);

module.exports = Applicant;
