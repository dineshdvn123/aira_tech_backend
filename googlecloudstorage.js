const { Storage } = require('@google-cloud/storage');
// Initialize Google Cloud Storage client
const storage = new Storage({
  keyFilename: './airatech-33a1f2bedf04.json', // Path to your service account JSON key
  projectId: 'airatech', // Your Google Cloud Project ID
});

module.exports = storage;
