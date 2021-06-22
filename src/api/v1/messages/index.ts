import { Router } from 'express';

import search from './search';
import send from './send';
import thread from './thread';
import draft from './draft';
import list from './list';

const router = Router();

router.use('/search', search);
router.use('/send', send);
router.use('/thread', thread);
router.use('/draft', draft);
router.use('/list', list);

export default router;
