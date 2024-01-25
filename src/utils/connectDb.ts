import mongoose from 'mongoose';
import config from './config';

/**
 * Connects to MongoDB using Mongoose.
 *
 * @function
 * @returns This function does not return a value.
 */
export default function connectDb() {
  try {
    mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
}
