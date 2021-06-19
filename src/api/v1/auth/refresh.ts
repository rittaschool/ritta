import { Router } from 'express';
import { AuthService } from '../../../services';

const router = Router();

router.post('/', async (req, res) => {
  if (!req.body.refresh_token) {
    return res
      .status(400)
      .json({
        message: 'refresh_token missing'
      })
  }
  try {
    const data = await AuthService.refreshToken(req.body.refresh_token);
    return res
      .status(200)
      .json(data)
  } catch(err)  {
    let errorMessage = err.message;
    switch(err.name) {
      case 'TokenExpiredError':
        errorMessage = 'The JWT has expired';
        break;
      case 'NotBeforeError':
      case 'JsonWebTokenError':
        errorMessage = 'The JWT is invalid'
        break;
    }
    return res
      .status(400)
      .json({
        messsage: errorMessage
      })
  }
});

export default router;