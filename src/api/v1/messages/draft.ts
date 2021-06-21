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
    const response = await MessageService.getDraft(
      req.body.jwt,
      req.body.account_id,
      req.body.thread_id
    );
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

router.post('/edit', checkJWT, async (req, res, next) => {
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
    const response = await MessageService.editDraft(
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

router.post('/publish', checkJWT, async (req, res, next) => {
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
    const response = await MessageService.publishDraft(
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
