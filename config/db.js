// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // await mongoose.connect('mongodb://localhost:27017/aira_tech_db', {
      await mongoose.connect('mongodb+srv://dineshdvn123:T3x33jF25Sff5B12@cluster0.yzilrsr.mongodb.net/aira_tech_db?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas', err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
