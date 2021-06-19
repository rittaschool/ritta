import { Router } from 'express';
import refresh from './refresh';
import login from './login';
import mfa from './mfa';

const router = Router();

router.use('/refresh', refresh);
router.use('/login', login);
router.use('/mfa', mfa);

export default router;