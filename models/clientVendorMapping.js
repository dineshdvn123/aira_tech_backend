// models/clientVendorMapping.js
const mongoose = require('mongoose');

const clientVendorMappingSchema = new mongoose.Schema({
  'END CLIENT NAME': { type: String, required: true },
  'END CLIENT LOCATION': { type: String },
  'VENDOR COMPANY NAME': { type: String, required: true },
  'VENDOR COMPANY WEBSITE': { type: String },
  'VENDOR COMPANY LOCATION': { type: String },
  'VENDOR CONTACT NAME': { type: String },
  'VENDOR PHONE': { type: String },
  'VENDOR EMAIL': { type: String }
}, { collection: 'Client_Vendor_Mapping' }); // Specify the collection name

const ClientVendorMapping = mongoose.model('ClientVendorMapping', clientVendorMappingSchema);

module.exports = ClientVendorMapping;
