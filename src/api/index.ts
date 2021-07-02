// Import API versions
import v1 from './v1';

export default (app) => {
  app.get('/', (_, res) => {
    res.status(200).json({
      message: 'API is running',
      apiVersions: {
        v1: {
          stable: true,
        },
      },
    });
  });
  app.register(v1, { prefix: '/v1' });
};
