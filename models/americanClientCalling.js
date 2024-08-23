const mongoose = require('mongoose');

const americanClientCallingSchema = new mongoose.Schema({
  'CLIENT NAME': { type: String, required: true },
  'PHONE NUMBERS': { type: String },
  'EMAIL': { type: String },
  'COMMENTS': { type: String },
}, { collection: 'American_Client_Calling' }); // Specify the collection name

const AmericanClientCalling = mongoose.model('AmericanClientCalling', americanClientCallingSchema);

module.exports = AmericanClientCalling;
