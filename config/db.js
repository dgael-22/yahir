const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dgaeltfp005_db_user:JT0fIyVmLcynH7SX@cluster0.cz0brlu.mongodb.net/?appName=Cluster0';

const connectDB = async () => {
  try {
    // REMOVER las opciones obsoletas
    await mongoose.connect(MONGO_URI); // <-- SOLO esto
    console.log('✅ MongoDB connected successfully');

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
