import { AuthService } from '../../../services';

export default (router) => {
  router.post('/', async (req, res) => {
    if (!req.body.refresh_token) {
      return res.status(400).json({
        message: 'refresh_token missing',
      });
    }
    const data = await AuthService.refreshToken(req.body.refresh_token);
    return res.status(200).json(data);
  });
};
