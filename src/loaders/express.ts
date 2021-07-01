import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import config from '../config';

export default async ({
  app,
}: {
  app: express.Application;
}): Promise<express.Application> => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });
  app.enable('trust proxy');

  app.use(cors());
  app.use(helmet());
  app.use(morgan(process.env.NODE_ENV === 'PRODUCTION' ? 'tiny' : 'dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  (global as any).rateLimit = new RateLimit({
    max: 3,
    windowMs: 30 * 1000,
    handler: (_req: express.Request, res: express.Response) => {
      res.status(429).json({ message: 'You are being rate limited' });
    },
  });
  // Return the express app
  return app;
};
