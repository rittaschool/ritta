import { Router } from 'express';
import refresh from './refresh';
import login from './login';
import mfa from './mfa';
import opinsys from './opinsys';

const router = Router();

router.use('/refresh', refresh);
router.use('/login', login);
router.use('/mfa', mfa);
router.use('/opinsys', opinsys);

export default router;
