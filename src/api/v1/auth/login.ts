import { Router } from 'express';
import { AuthService } from '../../../services';

const router = Router();

router.post('/', async (req, res) => {
  if (!req.body.username) {
    return res
      .status(400)
      .json({
        message: 'username missing'
      })
  }
  if (!req.body.password) {
    return res
      .status(400)
      .json({
        message: 'password missing'
      })
  }
  try {
    const data = await AuthService.login(req.body.username, req.body.password);
    return res
      .status(200)
      .json(data)
  } catch(err)  {
    return res
      .status(400)
      .json({
        messsage: err.message
      })
  }
});

export default router;