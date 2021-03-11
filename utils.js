const config = require("./config.js")
const crypto = require('crypto');
const ics = require("ics")
const IV_LENGTH = 16;
const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(config.encryptionKey)).digest('base64').substr(0, 16);


exports.genUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

exports.encrypt = function(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

exports.decrypt = function(text) {
  let textParts = text.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
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
