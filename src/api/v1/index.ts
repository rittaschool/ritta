import { Router } from 'express';

import auth from './auth';
import user from './user';
import message from './messages';
const router = Router();

router.use('/user', user);
router.use('/auth', auth);
router.use('/messages', message);

router.use((err: Error, _req, res, _next) => {
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
});
export default router;
