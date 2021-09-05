// General information about Ritta instance

import config from '../../config';

export default (router, _opts, done) => {
  router.get('/', {}, (req, res) => {
    res.send({
      name: config.name,
      frontUrl: config.frontUrl,
      opinsys: {
        enabled: config.opinsys.enabled,
        organization: config.opinsys.organization,
      },
      yubikey: {
        enabled: config.yubikey.enabled,
      },
    });
  });
  done();
};
