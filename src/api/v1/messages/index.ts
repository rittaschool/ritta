import search from './search';
import send from './send';
import thread from './thread';
import draft from './draft';
import list from './list';
import announcement from './announcement';

export default (router, _opts, done) => {
  router.register(search, { prefix: '/search' });
  router.register(send, { prefix: '/send' });
  router.register(thread, { prefix: '/thread' });
  router.register(draft, { prefix: '/draft' });
  router.register(list, { prefix: '/list' });
  router.register(announcement, { prefix: '/announcement' });
  done();
};
