import mongoose from 'mongoose'
import config from '../config';
import logger from '../logger';

export default async (): Promise<any> => {
  try {
    const connection = await mongoose.connect(config.databaseURI, { useNewUrlParser: true, useUnifiedTopology: true });
    return connection.connection.db;
  } catch(error) {
    logger.error(error.message);
    process.exit(-1);
  }
}