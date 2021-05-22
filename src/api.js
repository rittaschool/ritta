const express = require('express');

const api = new express.Router();
const v1 = new express.Router();

const apiVersions = [
  v1,
];

// Registering apiVersions
apiVersions.forEach((apiRoute, index) => {
  api.use(`/v${index + 1}`, apiRoute);
});

module.exports = {
  apiVersions,
  add: (path, router, version = (apiVersions.length - 1)) => {
    // This function is here to register API routers from other parts of code easily.
    if (!module.exports.apiVersions[version]) {
      throw new Error('API Version not found');
    }
    module.exports.apiVersions[version].use(path, router);
  },
  apiRoute: api,
};
