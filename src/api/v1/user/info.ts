import { Router } from 'express';
import { UserService } from '../../../services';
import { checkJWT } from '../../../utils';

const router = Router();

router.post('/', checkJWT, async (req, res, next) => {
  try {
    const user = await UserService.getUser(req.body.jwt);
    res.status(200).json({
      user,
      accounts: await UserService.listAccounts(req.body.jwt),
    });
  } catch (e) {
    next(e);
  }
});

export default router;
