const config = require("./config.json")
const crypto = require('crypto');

exports.genUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
exports.setAccount = function(req, account) {
  req.session.account = account;
  req.session.save(function() {console.debug("Session saved")})
}

exports.encrypt = function(string) {
  let key = crypto.createCipher('aes-128-cbc', config.encryptionKey);
  let crypted = key.update(string, 'utf8', 'hex')
  crypted += key.final('hex');
  return crypted;
}

exports.decrypt = function(string) {
  var key = crypto.createDecipher('aes-128-cbc', config.encryptionKey);
  var string = key.update(string, 'hex', 'utf8')
  string += key.final('utf8');
  return string;
}

exports.isLoggedIn = function(req) {
  if(req.session.account) {
    if(database.isLoggedInByToken(req.session.account.token)) {
      return true;
    } else {
      utils.setAccount(req, undefined)
    }
  }
  return false;
}
