const mongoose = require('mongoose');
const { initDatabase } = require('../services/initDB');

let lastError = null;
let detectedEnvVar = null;
let isConnecting = false;

const getDbStatus = () => ({
  state: mongoose.connection.readyState,
  detectedEnvVar: detectedEnvVar || 'none',
  lastError: lastError || null,
});

/**
 * Scan known MongoDB environment variable names across hosting platforms
 */
const getMongoUri = () => {
  if (process.env.MONGO_URI && process.env.MONGO_URI.trim()) {
    return { uri: process.env.MONGO_URI.trim(), source: 'MONGO_URI' };
  }
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) {
    return { uri: process.env.MONGODB_URI.trim(), source: 'MONGODB_URI' };
  }
  if (
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL.trim() &&
    (process.env.DATABASE_URL.startsWith('mongodb://') ||
      process.env.DATABASE_URL.startsWith('mongodb+srv://'))
  ) {
    return { uri: process.env.DATABASE_URL.trim(), source: 'DATABASE_URL' };
  }
  if (process.env.MONGO_URL && process.env.MONGO_URL.trim()) {
    return { uri: process.env.MONGO_URL.trim(), source: 'MONGO_URL' };
  }
  return { uri: null, source: null };
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (isConnecting) return;

  isConnecting = true;
  const { uri, source } = getMongoUri();
  detectedEnvVar = source || 'none';

  if (!uri) {
    lastError =
      'No MongoDB URI configured in environment variables. Please set MONGO_URI in your Render service dashboard.';
    if (process.env.NODE_ENV !== 'production') {
      const localUri = 'mongodb://127.0.0.1:27017/jobconnect';
      try {
        console.log(`[MongoDB] Connecting to local instance: ${localUri}`);
        const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
        console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
        lastError = null;
        await initDatabase();
      } catch (err) {
        lastError = err.message;
        console.error(`[MongoDB] Local connection failed: ${err.message}`);
      } finally {
        isConnecting = false;
      }
      return;
    }

    console.error(`[MongoDB Notice] ${lastError}`);
    isConnecting = false;
    return;
  }

  try {
    console.log(`[MongoDB] Connecting using variable ${source}...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    lastError = null;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    await initDatabase();
  } catch (error) {
    // Sanitize any password from the error message
    const sanitizedError = error.message.replace(/(:\/\/[^:]+:)[^@]+(@)/, '$1***$2');
    lastError = sanitizedError;
    console.error(`[MongoDB Error] Connection failed (${source}): ${sanitizedError}`);
    console.error(
      'Troubleshooting: 1) Check that MONGO_URI in Render dashboard is valid. ' +
        '2) In MongoDB Atlas -> Network Access, ensure 0.0.0.0/0 (Allow access from anywhere) is active. ' +
        '3) If password has special characters like @, #, %, URL-encode them.'
    );
  } finally {
    isConnecting = false;
  }
};

// Periodic background reconnection retry (every 15 seconds)
setInterval(() => {
  if (mongoose.connection.readyState === 0 && !isConnecting) {
    const { uri } = getMongoUri();
    if (uri || process.env.NODE_ENV !== 'production') {
      connectDB().catch(() => {});
    }
  }
}, 15000);

module.exports = { connectDB, getDbStatus };
