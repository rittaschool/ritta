import { MessageService } from '../../../services';
import { checkJWT } from '../../../utils';

export default (router, _opts, done) => {
  router.post(
    '/',
    {
      preHandler: checkJWT,
    },
    async (req, res) => {
      if (!req.body.account_id) {
        return res.status(400).json({
          message: 'account_id missing',
        });
      }
      const response = await MessageService.getThreads(
        req.body.jwt,
        req.body.account_id,
        req.body.folder
      );
      res.status(200).json(response);
    }
  );
  done();
};
