import { MessageService } from '../../../services';
import { checkJWT } from '../../../utils';

export default (router, _opts, done) => {
  router.post(
    '/',
    {
      preHandler: checkJWT(true),
    },
    async (req, res) => {
      if (!req.body.announcement_id) {
        return res.status(400).send({
          message: 'announcement_id missing',
        });
      }
      const response = await MessageService.getAnnouncement(
        req.body.jwt,
        req.body.account_id,
        req.body.announcement_id
      );
      res.status(200).send(response);
    }
  );

  router.post(
    '/list',
    {
      preHandler: checkJWT(true),
    },
    async (req, res) => {
      const response = await MessageService.getAnnouncements(
        req.body.jwt,
        req.body.account_id
      );
      res.status(200).send(response);
    }
  );

  router.put(
    '/',
    {
      preHandler: checkJWT(),
    },
    async (req, res) => {
      if (!req.body.account_id) {
        return res.status(400).send({
          message: 'account_id missing',
        });
      }
      if (!req.body.name) {
        return res.status(400).send({
          message: 'name missing',
        });
      }
      if (!req.body.content) {
        return res.status(400).send({
          message: 'content missing',
        });
      }
      const response = await MessageService.newAnnouncement(
        req.body.jwt,
        req.body.account_id,
        req.body.name,
        req.body.content,
        req.body.public || true,
        req.body.forTeachers || false,
        req.body.forStaff || false,
        req.body.forStudents || false,
        req.body.forParents || false,
        req.body.school
      );
      res.status(200).send(response);
    }
  );
  done();
};
