import mongoose from 'mongoose';
import config from './config';

export default async function connectDb() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
}
