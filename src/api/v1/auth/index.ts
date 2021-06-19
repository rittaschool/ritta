import { Router } from 'express';
import refresh from './refresh';
import login from './login';

const router = Router();

router.use('/refresh', refresh);
router.use('/login', login);

export default router;