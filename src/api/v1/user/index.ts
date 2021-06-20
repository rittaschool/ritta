import { Router } from 'express';

import password from './password';

const router = Router();

router.use('/password', password);

export default router;