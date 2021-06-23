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
    if (!req.body.content) {
      return res.status(400).json({
        message: 'recipients missing',
      });
    }
    if (!req.body.name) {
      return res.status(400).json({
        message: 'name missing',
      });
    }
    if (!req.body.recipients) {
      return res.status(400).json({
        message: 'recipients missing',
      });
    }
    if (!Array.isArray(req.body.recipients)) {
      return res.status(400).json({
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
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

export default router;
