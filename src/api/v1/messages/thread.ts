import { Router } from 'express';
import { MessageService } from '../../../services';
import { checkJWT } from '../../../utils';

const router = Router();

router.post('/', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.account_id) {
      return res.status(400).json({
        message: 'account_id missing',
      });
    }
    if (!req.body.thread_id) {
      return res.status(400).json({
        message: 'thread_id missing',
      });
    }
    const response = await MessageService.getThread(
      req.body.jwt,
      req.body.account_id,
      req.body.thread_id
    );
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.post('/list', checkJWT, async (req, res, next) => {
  try {
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
  } catch (e) {
    next(e);
  }
});

router.post('/reply', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.account_id) {
      return res.status(400).json({
        message: 'account_id missing',
      });
    }
    if (!req.body.thread_id) {
      return res.status(400).json({
        message: 'thread_id missing',
      });
    }
    if (!req.body.content) {
      return res.status(400).json({
        message: 'content missing',
      });
    }
    const response = await MessageService.sendReplyToThread(
      req.body.jwt,
      req.body.account_id,
      req.body.thread_id,
      req.body.content
    );
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.post('/archive', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.account_id) {
      return res.status(400).json({
        message: 'account_id missing',
      });
    }
    if (!req.body.thread_id) {
      return res.status(400).json({
        message: 'thread_id missing',
      });
    }
    const response = await MessageService.archiveThread(
      req.body.jwt,
      req.body.account_id,
      req.body.thread_id
    );
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.post('/unarchive', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.account_id) {
      return res.status(400).json({
        message: 'account_id missing',
      });
    }
    if (!req.body.thread_id) {
      return res.status(400).json({
        message: 'thread_id missing',
      });
    }
    const response = await MessageService.unArchiveThread(
      req.body.jwt,
      req.body.account_id,
      req.body.thread_id
    );
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.post('/markRead', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.account_id) {
      return res.status(400).json({
        message: 'account_id missing',
      });
    }
    if (!req.body.thread_id) {
      return res.status(400).json({
        message: 'thread_id missing',
      });
    }
    const response = await MessageService.markThreadRead(
      req.body.jwt,
      req.body.account_id,
      req.body.thread_id
    );
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.post('/markUnread', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.account_id) {
      return res.status(400).json({
        message: 'account_id missing',
      });
    }
    if (!req.body.thread_id) {
      return res.status(400).json({
        message: 'thread_id missing',
      });
    }
    const response = await MessageService.markThreadUnread(
      req.body.jwt,
      req.body.account_id,
      req.body.thread_id
    );
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

export default router;
