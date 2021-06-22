import { Router } from 'express';
// Import API versions
import v1 from './v1';

const router = Router();

router.all('/', (_, res) => {
  res.status(200).json({
    message: 'API is running',
    apiVersions: {
      v1: {
        stable: true,
      },
    },
  });
});
router.use('/v1', v1);

export default router;
