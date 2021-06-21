import { Router } from 'express';
import { AuthService } from '../../../services';

const router = Router();

router.post('/', async (req, res, next) => {
  if (!req.body.refresh_token) {
    return res.status(400).json({
      message: 'refresh_token missing',
    });
  }
  try {
    const data = await AuthService.refreshToken(req.body.refresh_token);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
