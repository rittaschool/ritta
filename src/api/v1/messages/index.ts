import search from './search';
import send from './send';
import thread from './thread';
import draft from './draft';
import list from './list';

export default (router, _opts, done) => {
  router.use(search, { prefix: '/search' });
  router.use(send, { prefix: '/send' });
  router.use(thread, { prefix: '/thread' });
  router.use(draft, { prefix: '/draft' });
  router.use(list, { prefix: '/list' });
  done();
};
