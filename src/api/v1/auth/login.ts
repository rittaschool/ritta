import { AuthService } from '../../../services';

export default async (router) => {
  router.post(
    '/',
    {
      preHandler: router.rateLimit(),
    },
    async (req, res) => {
      if (!req.body.username) {
        return res.status(400).json({
          message: 'username missing',
        });
      }
      if (!req.body.password) {
        return res.status(400).json({
          message: 'password missing',
        });
      }
      const data = await AuthService.login(
        req.body.username,
        req.body.password
      );
      return res.status(200).json(data);
    }
  );
};
