// General information about Ritta instance

import config from '../../config';

export default (router) => {
  router.get('/', (req, res) => {
    res.json({
      school: {
        name: config.school.name,
        city: config.school.city,
        opinsysEnabled: config.opinsys.enabled,
        opinsysOrganization: config.opinsys.organization,
      },
    });
  });
};
