import { Router } from 'express';
import { UserService } from '../../../services';

const router = Router();

router.post('/change', async (req, res) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
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
        req.headers.authorization.split(' ')[1],
        req.body.old_password,
        req.body.new_password
      );
      return res.status(200).json(data);
    } catch (err) {
      let errorMessage = err.message;
      switch (err.name) {
        case 'TokenExpiredError':
          errorMessage = 'The JWT has expired';
          break;
        case 'NotBeforeError':
        case 'JsonWebTokenError':
          errorMessage = 'The JWT is invalid';
          break;
      }
      return res.status(400).json({
        messsage: errorMessage,
      });
    }
  } else {
    return res.status(401).json({
      message: 'Not logged in',
    });
  }
});

export default router;
