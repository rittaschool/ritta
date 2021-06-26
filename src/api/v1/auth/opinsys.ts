import { Router } from 'express';
import { AuthService } from '../../../services';
import config from '../../../config';

const router = Router();

router.post('/', async (req, res, next) => {
  if (!config.opinsys.enabled) {
    return res.status(403).json({
      message: 'Opinsys not enabled',
    });
  }
  if (!req.body.jwt) {
    return res.status(400).json({
      message: 'jwt missing',
    });
  }
  try {
    const data = await AuthService.opinsysAuth(req.query.jwt);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
