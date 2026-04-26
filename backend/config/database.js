import mongoose from 'mongoose';

const DEFAULT_MAX_CONNECT_RETRIES = 5;
const DEFAULT_RETRY_DELAY_MS = 5000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Add it to backend/.env before starting the server.');
  }

  const maxRetries = Number(process.env.DB_CONNECT_RETRIES || DEFAULT_MAX_CONNECT_RETRIES);
  const retryDelay = Number(process.env.DB_CONNECT_RETRY_DELAY_MS || DEFAULT_RETRY_DELAY_MS);

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
      });

      console.log('MongoDB connected successfully');
      return mongoose.connection;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      console.error(
        `MongoDB connection attempt ${attempt}/${maxRetries} failed: ${error.message}`
      );

      if (isLastAttempt) {
        throw new Error(`MongoDB connection failed after ${maxRetries} attempts`);
      }

      await wait(retryDelay);
    }
  }

  throw new Error('MongoDB connection failed unexpectedly');
};

export default connectDB;
