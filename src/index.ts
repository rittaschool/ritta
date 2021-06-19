import loaders from './loaders';
import express from 'express';
import http from 'http';
import logger from './logger';
import api from './api';
import config from './config';

logger.info('Starting Ritta Server')

const app = express();

await loaders({ expressApp: app });

app.use('/api', api);

app.all('/', (_, res) => {
  res.redirect(config.frontUrl);
})

app.all('*', (_, res: express.Response) => {
  res
    .status(404)
    .json(
      {
        message: 'Not found'
      }
    )
})

app.use((err, _req, res, _next) => {
  logger.error(err);
  res.status(500).send('Error occurred!')
})

const server = http.createServer(app);

server.listen(process.env.PORT || 3000, () => {
  logger.info(`Ritta Server is now running.`);
});

server.on('error', (error) => {
  logger.error(error);
});