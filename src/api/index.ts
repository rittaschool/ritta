import { Router } from 'express';
// Import API versions
import v1 from './v1';

const router = Router();

router.use('/v1', v1);

export default router;