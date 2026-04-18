const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Make sure MongoDB is running locally or update MONGODB_URI in .env');
    console.error('   To use MongoDB Atlas, update your .env file with your Atlas connection string');
    // Don't crash the process - let the server start anyway
  }
};

module.exports = connectDB;
