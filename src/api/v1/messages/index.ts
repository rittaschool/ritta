import { Router } from 'express';

import search from './search';
import send from './send';
import thread from './thread';
import draft from './draft';

const router = Router();

router.use('/search', search);
router.use('/send', send);
router.use('/thread', thread);
router.use('/draft', draft);

export default router;
