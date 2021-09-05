import config from '../../../config';
import { AuthService } from '../../../services';

export default (router, _opts, done) => {
  router.post(
    '/',
    {
      preValidation: [router.rateLimit()],
    },
    async (req, res) => {
      if (!config.yubikey.enabled) {
        return res.status(403).send({
          message: 'Yubikey not enabled',
        });
      }
      if (!req.body.otp) {
        return res.status(400).send({
          message: 'otp missing',
        });
      }
      if (!req.body.pin) {
        return res.status(400).send({
          message: 'pin missing',
        });
      }
      const data = await AuthService.yubiAuth(req.body.otp, req.body.pin);
      return res.status(200).send(data);
    }
  );
  done();
};
