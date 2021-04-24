// For testing purposes, if you want to fill a demo instance with a lot of users.
// Enable this, run ritta, wait for message "done" and then disable and restart.
const faker = require('faker');

faker.locale = 'fi';
const utils = require('../utils.js');

const amountOfUsers = 500;

exports.start = async (app, database) => {
  console.log('Initiliazing the faker module.');
  const { User } = database.models;
  const promises = [];
  const newUser = () => new Promise((resolve) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = faker.internet.password();
    const username = `${firstName}.${lastName}`.toLowerCase();
    database.validateUsername(username).then((userValid) => {
      if (!userValid) {
        const user = new User(
          {
            username,
            password: utils.encrypt(utils.hash(password)),
            role: 0,
            created: Date.now(),
            firstName,
            lastName,
          },
        );
        // Save the new model instance, passing a callback
        user.save((err) => {
          if (err) { console.debug(err); resolve(false); return; }
          console.debug(`${firstName} ${lastName} added.`);
          resolve(true);
        });
      } else {
        newUser();
        resolve(true);
      }
    });
  });
  for (let i = 0; i < amountOfUsers; i += 1) {
    promises.push(newUser());
  }
  await Promise.all(promises);
  console.log('Faker module process is now done! Disable the module instantly and restart after.');
};

exports.conf = {
  enabled: false,
};
