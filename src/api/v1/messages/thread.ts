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
      const response = await MessageService.getThread(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id
      );
      res.status(200).send(response);
    }
  );
  router.post(
    '/reply',
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
      const response = await MessageService.sendReplyToThread(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id,
        req.body.content
      );
      res.status(200).send(response);
    }
  );
  router.post(
    '/archive',
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
      const response = await MessageService.archiveThread(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id
      );
      res.status(200).send(response);
    }
  );
  router.post(
    '/unarchive',
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
      const response = await MessageService.unArchiveThread(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id
      );
      res.status(200).send(response);
    }
  );
  router.post(
    '/markread',
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
      const response = await MessageService.markThreadRead(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id
      );
      res.status(200).send(response);
    }
  );
  router.post(
    '/markunread',
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
      const response = await MessageService.markThreadUnread(
        req.body.jwt,
        req.body.account_id,
        req.body.thread_id
      );
      res.status(200).send(response);
    }
  );
  done();
};
