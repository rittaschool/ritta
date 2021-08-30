import { MessageService } from '../../../services';
import { checkJWT } from '../../../utils';

export default (router, _opts, done) => {
  router.put(
    '/',
    {
      preHandler: checkJWT(),
    },
    async (req, res) => {
      if (!req.body.account_id) {
        return res.status(400).send({
          message: 'account_id missing',
        });
      }
      if (!req.body.content) {
        return res.status(400).send({
          message: 'recipients missing',
        });
      }
      if (!req.body.name) {
        return res.status(400).send({
          message: 'name missing',
        });
      }
      if (!req.body.recipients) {
        return res.status(400).send({
          message: 'recipients missing',
        });
      }
      if (!Array.isArray(req.body.recipients)) {
        return res.status(400).send({
          message: 'recipients not array',
        });
      }
      const response = await MessageService.startThread(
        req.body.jwt,
        req.body.account_id,
        req.body.name,
        req.body.content,
        req.body.recipients,
        req.body.draft || false
      );
      res.status(200).send(response);
    }
  );
  done();
};
