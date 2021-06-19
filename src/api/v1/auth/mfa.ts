import { Router } from 'express';
import { AuthService } from '../../../services';

const router = Router();

router.post('/verify', async (req, res) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    if (!req.body.mfa_code) {
      return res
        .status(400)
        .json({
          message: 'mfa_code missing'
        })
    }
    try {
      const data = await AuthService.verifyMFA(req.headers.authorization.split(' ')[1], req.body.mfa_code);
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
  } else {
    return res
      .status(401)
      .json({
        message: 'Not logged in'
      })
  }
});

/*
 * Generate a MFA code if user does not have MFA enabled
 */
router.post('/generate', async (req, res) => {
  try {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const data = await AuthService.generateMFA(req.headers.authorization.split(' ')[1]);
      return res
      .status(200)
      .json(data)
    } else {
      return res
        .status(401)
        .json({
          message: 'Not logged in'
        })
    }
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
})

/*
 * Verify generated MFA code and enable MFA.
 */
router.post('/enable', async (req, res) => {
  try {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      if (!req.body.mfa_secret) {
        return res
          .status(400)
          .json({
            message: 'mfa_secret missing'
          })
      }
      if (!req.body.mfa_code) {
        return res
          .status(400)
          .json({
            message: 'mfa_code missing'
          })
      }
      const data = await AuthService.enableMFA(req.headers.authorization.split(' ')[1], req.body.mfa_secret, req.body.mfa_code);
      return res
      .status(200)
      .json(data)
    } else {
      return res
        .status(401)
        .json({
          message: 'Not logged in'
        })
    }
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
})

export default router;