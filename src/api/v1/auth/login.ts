import { Router } from 'express';
import { AuthService } from '../../../services';

const router = Router();

router.post('/', async (req, res) => {
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
  try {
    const data = await AuthService.login(req.body.username, req.body.password);
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
});

export default router;
