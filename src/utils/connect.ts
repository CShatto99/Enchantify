import { MongoClient } from 'mongodb';
import config from './config';

function getMongoClient() {
  try {
    const client = new MongoClient(config.MONGO_URI);
    return client;
  } catch (error) {
    console.error('Error creating MongoDB client:', error);
    throw error;
  }
}

export function connectToDatabase(dbName: string) {
  const client = getMongoClient();
  const database = client.db(dbName);
  return database;
}
