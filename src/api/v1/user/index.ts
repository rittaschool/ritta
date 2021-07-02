import password from './password';
import info from './info';

export default (app, _opts, done) => {
  app.register(password, { prefix: '/password' });
  app.register(info, { prefix: '/info' });
  done();
};
