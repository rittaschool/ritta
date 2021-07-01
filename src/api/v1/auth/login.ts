import { Router } from 'express';
import { AuthService } from '../../../services';

const router = Router();

router.post('/', (global as any).rateLimit, async (req, res, next) => {
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
