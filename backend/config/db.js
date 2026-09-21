const mongoose = require('mongoose');
const { initDatabase } = require('../services/initDB');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobconnect';

  if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
    console.warn(
      '[MongoDB Notice] MONGO_URI is not set in Render environment variables. ' +
      'Attempting fallback connection. Please configure MONGO_URI in your Render service settings.'
    );
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    // Auto-verify and seed companies catalog if database is fresh
    await initDatabase();
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    console.error(
      'Troubleshooting: Ensure MONGO_URI is set correctly in Render environment variables, ' +
      'and verify that MongoDB Atlas Network Access permits 0.0.0.0/0 (Allow access from anywhere).'
    );
    // Do NOT exit process so Express can stay online for health checks & diagnostic logs
  }
};

module.exports = connectDB;
