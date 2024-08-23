const mongoose = require('mongoose');

const consultantSchema = new mongoose.Schema({
  'CONSULTANTS NAME': { type: String, required: true },
  'PHONE': { type: String },
  'EMAIL': { type: String },
  'TECHNICAL SKILLS': { type: String },
  'CURRENT LOCATION': { type: String },
});

const Consultant = mongoose.model('Consultant', consultantSchema);

module.exports = Consultant;
