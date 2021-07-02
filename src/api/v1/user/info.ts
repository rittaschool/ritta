import { UserService } from '../../../services';
import { checkJWT } from '../../../utils';

export default (router) => {
  router.post(
    '/',
    {
      preHandler: checkJWT,
    },
    async (req, res) => {
      const user = await UserService.getUser(req.body.jwt);
      res.status(200).json({
        user,
        accounts: await UserService.listAccounts(req.body.jwt),
      });
    }
  );
};
