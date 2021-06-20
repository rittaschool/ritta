import { Router } from 'express';

import auth from './auth';
import user from './user';

const router = Router();

router.use('/user', user);
router.use('/auth', auth);

export default router;