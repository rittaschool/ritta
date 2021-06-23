import { Router } from 'express';
import { UserService } from '../../../services';
import { checkJWT } from '../../../utils';

const router = Router();

router.post('/change', checkJWT, async (req, res, next) => {
  if (!req.body.old_password) {
    return res.status(400).json({
      message: 'old_password missing',
    });
  }
  if (!req.body.new_password) {
    return res.status(400).json({
      message: 'new_password missing',
    });
  }
  try {
    const data = await UserService.changePassword(
      req.body.jwt,
      req.body.old_password,
      req.body.new_password
    );
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
