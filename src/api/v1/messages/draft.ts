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
        return res.status(400).send({
          message: 'account_id missing',
        });
      }
      if (!req.body.thread_id) {
        return res.status(400).send({
          message: 'thread_id missing',
        });
      }
      const response = await MessageService.getDraft(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id
      );
      res.status(200).send(response);
    }
  );
  router.post(
    '/edit',
    {
      preHandler: checkJWT,
    },
    async (req, res) => {
      if (!req.body.account_id) {
        return res.status(400).send({
          message: 'account_id missing',
        });
      }
      if (!req.body.thread_id) {
        return res.status(400).send({
          message: 'thread_id missing',
        });
      }
      if (!req.body.content) {
        return res.status(400).send({
          message: 'content missing',
        });
      }
      const response = await MessageService.editDraft(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id,
        req.body.content,
        req.body.recipients
      );
      res.status(200).send(response);
    }
  );
  router.post(
    '/publish',
    {
      preHandler: checkJWT,
    },
    async (req, res) => {
      if (!req.body.account_id) {
        return res.status(400).send({
          message: 'account_id missing',
        });
      }
      if (!req.body.thread_id) {
        return res.status(400).send({
          message: 'thread_id missing',
        });
      }
      const response = await MessageService.publishDraft(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id
      );
      res.status(200).send(response);
    }
  );
  done();
};
