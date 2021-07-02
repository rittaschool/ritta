import { AuthService } from '../../../services';
import { checkJWT } from '../../../utils';

export default (router, _opts, done) => {
  router.post(
    '/verify',
    {
      preValidation: [router.rateLimit(), checkJWT],
    },
    async (req, res) => {
      if (!req.body.mfa_code) {
        return res.status(400).json({
          message: 'mfa_code missing',
        });
      }
      const data = await AuthService.verifyMFA(req.body.jwt, req.body.mfa_code);
      return res.status(200).json(data);
    }
  );
  /*
   * Generate a MFA code if user does not have MFA enabled
   */
  router.post(
    '/generate',
    {
      preHandler: checkJWT,
    },
    async (req, res) => {
      const data = await AuthService.generateMFA(req.body.jwt);
      return res.status(200).json(data);
    }
  );
  /*
   * Verify generated MFA code and enable MFA.
   */
  router.post(
    '/enable',
    {
      preHandler: checkJWT,
    },
    async (req, res) => {
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
    }
  );
  done();
};
