// models/rpo.js
const mongoose = require('mongoose');

const rpoSchema = new mongoose.Schema({
  'COMPANY NAME': { type: String, required: true },
  'CONTACT PERSON': { type: String, required: true },
  'DESIGNATION / TITLE': { type: String, required: true },
  'EMAIL': { type: String, required: true },
  'PHONE NUMBER': { type: String, required: true },
  'LOCATION': { type: String },
  'COMPANY SIZE': { type: String },
  'COMPANY WEBSITE': { type: String }
}, { collection: 'RPO' }); // Specify the collection name

const RPO = mongoose.model('RPO', rpoSchema);

module.exports = RPO;
