import { AuthService } from '../../../services';

export default async (router, _opts, done) => {
  router.post(
    '/',
    {
      preHandler: router.rateLimit(),
    },
    async (req, res) => {
      if (!req.body.username) {
        return res.status(400).send({
          message: 'username missing',
        });
      }
      if (!req.body.password) {
        return res.status(400).send({
          message: 'password missing',
        });
      }
      const data = await AuthService.login(
        req.body.username,
        req.body.password
      );
      return res.status(200).send(data);
    }
  );
  done();
};
