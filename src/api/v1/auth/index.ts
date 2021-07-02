import refresh from './refresh';
import login from './login';
import mfa from './mfa';
import opinsys from './opinsys';

export default (router, _opts, done) => {
  router.register(refresh, { prefix: '/refresh' });
  router.register(login, { prefix: '/login' });
  router.register(mfa, { prefix: '/mfa' });
  router.register(opinsys, { prefix: '/opinsys' });
  done();
};
