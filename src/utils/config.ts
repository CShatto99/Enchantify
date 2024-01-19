import 'dotenv/config';
import process from 'process';

const config = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  BOT_TOKEN: process.env.BOT_TOKEN || '',
  APPLICATION_ID: process.env.APPLICATION_ID || '',
  SERVER_ID: process.env.SERVER_ID || '',
};

export default config;
