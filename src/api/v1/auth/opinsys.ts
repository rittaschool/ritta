import config from '../../../config';
import { AuthService } from '../../../services';

export default (router) => {
  router.post(
    '/',
    {
      preValidation: [router.rateLimit()],
    },
    async (req, res) => {
      if (!config.opinsys.enabled) {
        return res.status(403).json({
          message: 'Opinsys not enabled',
        });
      }
      if (!req.body.jwt) {
        return res.status(400).json({
          message: 'jwt missing',
        });
      }
      const data = await AuthService.opinsysAuth(req.body.jwt);
      return res.status(200).json(data);
    }
  );
};
