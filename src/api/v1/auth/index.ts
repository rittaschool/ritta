import refresh from './refresh';
import login from './login';
import mfa from './mfa';
import opinsys from './opinsys';

export default (router) => {
  router.use(refresh, { prefix: '/refresh' });
  router.use(login, { prefix: '/login' });
  router.use(mfa, { prefix: '/mfa' });
  router.use(opinsys, { prefix: '/opinsys' });
};
