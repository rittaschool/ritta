import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jwt from 'express-jwt';
import config from '../config';

export default async ({ app }: { app: express.Application }): Promise<express.Application> => {
  app.get('/status', (req, res) => { res.status(200).end(); });
  app.head('/status', (req, res) => { res.status(200).end(); });
  app.enable('trust proxy');

  app.use(cors());
  app.use(helmet());
  app.use(morgan(process.env.NODE_ENV === 'PRODUCTION' ? 'tiny' : 'dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // Return the express app
  return app;
};