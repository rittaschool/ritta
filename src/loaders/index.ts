import expressLoader from './express';
import mongooseLoader from './mongoose';
import logger from '../logger';

export default async ({ expressApp }): Promise<any> => {
  const mongoConnection = await mongooseLoader();
  logger.info('MongoDB Initialized');

  await expressLoader({ app: expressApp });
  logger.info('Express Initialized');

  return {
    mongoConnection,
  };
};
