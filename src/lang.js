/* eslint-disable import/no-dynamic-require */
const config = require('./config');

module.exports = {
  get: () => {
    try {
      return require(`../lang/${config.lang}/lang.json`);
    } catch (e) {
      return false;
    }
  },
};
