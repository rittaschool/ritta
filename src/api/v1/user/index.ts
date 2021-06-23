import { Router } from 'express';

import password from './password';
import info from './info';

const router = Router();

router.use('/password', password);
router.use('/info', info);

export default router;
