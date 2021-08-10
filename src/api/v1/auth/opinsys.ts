import config from '../../../config';
import { AuthService } from '../../../services';

export default (router, _opts, done) => {
  router.post(
    '/',
    {
      preValidation: [router.rateLimit()],
    },
    async (req, res) => {
      if (!config.opinsys.enabled) {
        return res.status(403).send({
          message: 'Opinsys not enabled',
        });
      }
      if (!req.body.jwt) {
        return res.status(400).send({
          message: 'jwt missing',
        });
      }
      const data = await AuthService.opinsysAuth(req.body.jwt);
      return res.status(200).send(data);
    }
  );
  done();
};
