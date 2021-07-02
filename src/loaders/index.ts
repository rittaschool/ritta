import fastifyLoader from './fastify';
import mongooseLoader from './mongoose';
import logger from '../logger';

export default async ({ fastifyApp }): Promise<any> => {
  const mongoConnection = await mongooseLoader();
  logger.info('MongoDB Initialized');

  await fastifyLoader({ app: fastifyApp });
  logger.info('Fastify Initialized');

  return {
    mongoConnection,
  };
};
