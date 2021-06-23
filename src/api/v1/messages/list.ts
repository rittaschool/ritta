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

export default router;
