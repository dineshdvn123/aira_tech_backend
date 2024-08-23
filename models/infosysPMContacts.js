// models/infosysPMContacts.js
const mongoose = require('mongoose');

const infosysPMContactsSchema = new mongoose.Schema({
  'PROJECT MANAGER': { type: String, required: true },
  'PROJECT MANAGER - EMAIL': { type: String, required: true }
}, { collection: 'Infosys_PM_Contacts' }); // Specify the collection name

const InfosysPMContacts = mongoose.model('InfosysPMContacts', infosysPMContactsSchema);

module.exports = InfosysPMContacts;
