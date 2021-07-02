import config from '../../../config';
import express, { Router } from 'express';
import { AuthService } from '../../../services';
import RateLimit from 'express-rate-limit';

const router = Router();

const rateLimit = RateLimit({
  max: 3,
  windowMs: 30 * 1000,
  handler: (_req: express.Request, res: express.Response) => {
    res.status(429).json({ message: 'You are being rate limited' });
  },
});

router.post('/', rateLimit, async (req, res, next) => {
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
    const data = await AuthService.opinsysAuth(req.body.jwt);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
