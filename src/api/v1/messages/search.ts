import { MessageService } from '../../../services';
import { checkJWT } from '../../../utils';

export default (router, _opts, done) => {
  router.post(
    '/recipients',
    {
      preHandler: checkJWT,
    },
    async (req, res) => {
      if (!req.body.account_id) {
        return res.status(400).send({
          message: 'account_id missing',
        });
      }
      if (!req.body.query) {
        return res.status(400).send({
          message: 'query missing',
        });
      }
      const recipients = await MessageService.searchRecipients(
        req.body.jwt,
        req.body.account_id,
        req.body.query
      );
      res.status(200).send(recipients);
    }
  );
  done();
};
