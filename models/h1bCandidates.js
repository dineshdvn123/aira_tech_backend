const mongoose = require('mongoose');
const h1bCandidateSchema = new mongoose.Schema({
  'CONSULTANT NAME': { type: String, required: true },
  'PHONE': { type: String },
  'EMAIL': { type: String },
  'TECHNICAL SKILLS': { type: String },
  'CURRENT LOCATION': { type: String },
  'RATES': { type: String },
}, { collection: '20k_H1B_Candidates' }); // Specify the collection name);

const H1BCandidate = mongoose.model('H1BCandidate', h1bCandidateSchema);

module.exports = H1BCandidate;

console.log('H1BCandidate Model:', H1BCandidate);
