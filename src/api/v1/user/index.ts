import { Router } from 'express';

import password from './password';
import accounts from './accounts';

const router = Router();

router.use('/password', password);
router.use('/accounts', accounts);

export default router;
