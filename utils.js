const config = require("./config.json")
const crypto = require('crypto');
const ics = require("ics")

let database;
try {
  database = require("./database/"+config.databaseType+".js")
} catch(e) {
  console.debug(e)
  console.log("Database file not found. Check your config.")
  process.exit()
}

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
      exports.setAccount(req, undefined)
    }
  }
  return false;
}

exports.usernameFromToken = function(req) {
  if(req.session.account) {
    var token = exports.decrypt(req.session.account.token)
    let split = token.split(":")
    let username = split[0];
    username = exports.decrypt(username);
    return username;
  }
  return false;
}

exports.createCalendar = function(attributes) {
  // Attributes example:
  /*
  [{
    title: 'Lunch',
    start: [2018, 1, 15, 12, 15],
    duration: { minutes: 45 }
  },
  {
    title: 'Dinner',
    start: [2018, 1, 15, 12, 15],
    duration: { hours: 1, minutes: 30 }
  }]
  */
  const { error, value } = ics.createEvents(attributes)

  if (error) {
    console.log(error)
    return;
  }
  return value;
}
