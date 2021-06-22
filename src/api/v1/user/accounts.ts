import { Router } from 'express';
import { UserService } from '../../../services';
import { checkJWT } from '../../../utils';

const router = Router();

router.post('/', checkJWT, async (req, res) => {
  res.status(200).json(await UserService.listAccounts(req.body.jwt));
});
export default router;
