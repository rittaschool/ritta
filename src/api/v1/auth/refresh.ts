import { AuthService } from '../../../services';

export default (router, _opts, done) => {
  router.post('/', {}, async (req, res) => {
    if (!req.body.refresh_token) {
      return res.status(400).send({
        message: 'refresh_token missing',
      });
    }
    const data = await AuthService.refreshToken(req.body.refresh_token);
    return res.status(200).send(data);
  });
  done();
};
