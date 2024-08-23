const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb+srv://dineshdvn123:dineshdvndvn@cluster0.yzilrsr.mongodb.net/aira_tech_admin_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

module.exports = connectToDatabase;