// General information about Ritta instance

import { Router } from 'express';
import config from '../../config';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    school: {
      name: config.school.name,
      city: config.school.city,
      opinsysEnabled: config.opinsys.enabled,
    },
  });
});

export default router;
