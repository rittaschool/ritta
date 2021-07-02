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
  try {
    if (!req.body.username) {
      return res.status(400).json({
        message: 'username missing',
      });
    }
    if (!req.body.password) {
      return res.status(400).json({
        message: 'password missing',
      });
    }
    const data = await AuthService.login(req.body.username, req.body.password);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
