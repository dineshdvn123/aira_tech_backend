// models/vendors.js
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  'Email': { type: String, required: true }
}, { collection: 'Vendors' }); // Specify the collection name

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
