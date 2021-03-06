// Import API versions
import v1 from './v1';

export default (app, _opts, done) => {
  app.get('/', {}, (_, res) => {
    res.status(200).send({
      message: 'API is running',
      apiVersions: {
        v1: {
          stable: true,
        },
      },
    });
  });
  app.register(v1, { prefix: '/v1' });
  done();
};
