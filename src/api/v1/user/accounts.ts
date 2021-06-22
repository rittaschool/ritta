import { Router } from 'express';
import { UserService } from '../../../services';
import { checkJWT } from '../../../utils';

const router = Router();

router.post('/', checkJWT, async (req, res, next) => {
  try {
    res.status(200).json(await UserService.listAccounts(req.body.jwt));
  } catch (e) {
    next(e);
  }
});
export default router;
