import password from './password';
import info from './info';

export default (app, _opts, done) => {
  app.use(password, { prefix: '/password' });
  app.use(info, { prefix: '/info' });
  done();
};
