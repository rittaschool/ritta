import { UserService } from '../../../services';
import { checkJWT } from '../../../utils';

export default (router, _opts, done) => {
  router.post(
    '/change',
    {
      preHandler: checkJWT,
    },
    async (req, res) => {
      if (!req.body.old_password) {
        return res.status(400).json({
          message: 'old_password missing',
        });
      }
      if (!req.body.new_password) {
        return res.status(400).json({
          message: 'new_password missing',
        });
      }
      const data = await UserService.changePassword(
        req.body.jwt,
        req.body.old_password,
        req.body.new_password
      );
      return res.status(200).json(data);
    }
  );
  done();
};
