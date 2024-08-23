const { Storage } = require('@google-cloud/storage');
// Initialize Google Cloud Storage client
const storage = new Storage({
  keyFilename: './airatechresumestorage-be0f1e0739c8.json', // Path to your service account JSON key
  projectId: 'airatechresumestorage', // Your Google Cloud Project ID
});

module.exports = storage;
