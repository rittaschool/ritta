/* eslint-disable no-bitwise */
const crypto = require('crypto');
const ics = require('ics');
const config = require('./config.js');

const IV_LENGTH = 16;
const ENCRYPTION_KEY = crypto.createHash('sha256').update(String(config.encryptionKey)).digest('base64').substr(0, 16);

exports.genUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0; const
    // eslint-disable-next-line no-mixed-operators
    v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

exports.decrypt = (text) => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

exports.createCalendar = (attributes) => {
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
  const { error, value } = ics.createEvents(attributes);

  if (error) {
    console.log(error);
    return false;
  }
  return value;
};
