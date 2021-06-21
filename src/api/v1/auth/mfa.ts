import { Router } from 'express';
import { AuthService } from '../../../services';
import { checkJWT } from '../../../utils';

const router = Router();

router.post('/verify', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.mfa_code) {
      return res.status(400).json({
        message: 'mfa_code missing',
      });
    }
    const data = await AuthService.verifyMFA(req.body.jwt, req.body.mfa_code);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

/*
 * Generate a MFA code if user does not have MFA enabled
 */
router.post('/generate', checkJWT, async (req, res, next) => {
  try {
    const data = await AuthService.generateMFA(req.body.jwt);
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

/*
 * Verify generated MFA code and enable MFA.
 */
router.post('/enable', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.mfa_secret) {
      return res.status(400).json({
        message: 'mfa_secret missing',
      });
    }
    if (!req.body.mfa_code) {
      return res.status(400).json({
        message: 'mfa_code missing',
      });
    }
    const data = await AuthService.enableMFA(
      req.body.jwt,
      req.body.mfa_secret,
      req.body.mfa_code
    );
    return res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
