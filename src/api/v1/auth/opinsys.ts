import { Router } from 'express';
import { AuthService } from '../../../services';
import config from '../../../config';

const router = Router();

router.get('/', async (req, res) => {
  if (!config.opinsys.enabled) {
    return res.status(403).json({
      message: 'Opinsys not enabled',
    });
  }
  if (!req.query.jwt) {
    return res.status(400).json({
      message: 'jwt missing',
    });
  }
  try {
    const data = await AuthService.opinsysAuth(req.query.jwt);
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
