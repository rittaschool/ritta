import { Router } from 'express';
import { MessageService } from '../../../services';
import { checkJWT } from '../../../utils';

const router = Router();

router.post('/recipients', checkJWT, async (req, res, next) => {
  try {
    if (!req.body.account_id) {
      return res.status(400).json({
        message: 'account_id missing',
      });
    }
    if (!req.body.query) {
      return res.status(400).json({
        message: 'query missing',
      });
    }
    const recipients = await MessageService.searchRecipients(
      req.body.jwt,
      req.body.account_id,
      req.body.query
    );
    res.status(200).json(recipients);
  } catch (e) {
    next(e);
  }
});

export default router;
