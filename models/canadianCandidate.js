const mongoose = require('mongoose');

// Define the schema for Canadian Candidates
const canadianCandidateSchema = new mongoose.Schema({
  'NAME': { type: String, required: true },
  'PHONE NUMBER': { type: String },
  'EMAIL': { type: String },
  'SKILLS': { type: String },
  'LOCATION': { type: String }
}, { collection: 'Canadian_Candidates' }); // Specify the collection name

// Create the model
const CanadianCandidate = mongoose.model('CanadianCandidate', canadianCandidateSchema);

module.exports = CanadianCandidate;
