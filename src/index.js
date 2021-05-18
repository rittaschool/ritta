// NPMJS Modules
const fs = require('fs');
const passport = require('passport');
const OpinsysStrategy = require('passport-opinsys');
const { Strategy, GoogleAuthenticator } = require('passport-2fa-totp-v2');

require('dotenv').config();

// Local modules
let database;

// Remove the useless part of argv
process.argv = process.argv.slice(2);

// Debug mode
const debugMode = process.argv.includes('debug');

// Custom console.log
console.log = (d = '') => {
  process.stdout.write(`Ritta » ${d}\n`);
};

console.debug = (d = '') => {
  if (debugMode) process.stdout.write(`Debug » ${d}\n`);
};

// Enabled message
if (debugMode) console.debug('Debug mode enabled');

// Start

// process.env => config

if (
  !process.env.SCHOOL_MULTISCHOOL
  || !process.env.SCHOOL_NAME
  || !process.env.SCHOOL_CITY
  || !process.env.LANGUAGE
  || !process.env.SSL_KEY
  || !process.env.SSL_CERT
  || !process.env.OPINSYS_ENABLED
  || !process.env.OPINSYS_ORGANIZATION
  || !process.env.OPINSYS_REDIRECTURI
  || !process.env.OPINSYS_SECRET
) {
  console.log('Environment variables are missing values. Please consult the installation guide.');
  process.exit();
}

const config = require('./config');

try {
  database = require('./database.js');
  database.connect(config.database);
} catch (e) {
  console.debug(e);
  console.log('Error while loading the database file or connecting.');
  process.exit();
}

// Checking encryption key if not set
if (!process.env.ENCRYPTION_KEY || !process.env.SESSION_SECRET || !process.env.HASH_SALT) {
  console.log('ENV Configuration is missing the encryption key, the hash salt or the session secret! Set the ENCRYPTION_KEY, HASH_SALT and the SESSION_SECRET ');
  process.exit();
}

// Opinsys
const opinsys = config.opinsys.enabled;
const opinsysOrganization = config.opinsys.organization;
const opinsysRedirect = config.opinsys.redirectURI;
const opinsysSecret = config.opinsys.secret;

// Register passport strategies!
passport.use(new Strategy(
  ((username, password, done) => {
    database.validate(username, password).then((isValid) => {
      if (isValid) {
        database.getUserData(username).then((user) => {
          done(null, user);
        });
      } else {
        done(null, false, { message: 'invalid' });
      }
    });
  }),
  (user, done) => {
    if (!user.secret) {
      done(null, null);
    } else {
      const secret = GoogleAuthenticator.decodeSecret(user.secret);
      done(null, secret);
    }
  },
));

if (opinsys) {
  passport.use(new OpinsysStrategy(
    {
      redirectURI: opinsysRedirect,
      secret: opinsysSecret,
      organization: opinsysOrganization,
    },
    ((profile, done) => {
      if (profile.organisation_domain !== opinsysOrganization) {
        done(null, false, { message: 'opinsysinvalidorganization' });
        return;
      }
      database.validateUsername(profile.username).then((usernameValid) => {
        if (usernameValid) {
          database.getUserData(profile.username).then((user) => {
            done(null, user);
          });
        } else {
          done(null, false, { message: 'opinsysaccountnone' });
        }
      });
    }),
  ));
}

// Setup session

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((id, done) => {
  database.getUserData(id).then((user) => {
    done(false, user);
  });
});

const web = require('./web');

web.start();

/**
 * Load modules from modules/
 */
fs.readdir('./src/modules/', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading ${files.length} modules.`);
  files.forEach((f) => {
    const module = require(`./modules/${f}`);
    if (!module.conf.enabled || module.conf.executeOnRequest) {
      console.debug(`Module ${f} disabled, skipping...`);
      return;
    }
    console.debug(`Loading module: ${f}.`);
    if (module.start) module.start(app, database);
  });
});

// Events

process.on('exit', code => console.log(`Ritta stopping with exit code ${code}`));

process.on('SIGINT', () => {
  console.log('Control-C detected. Stopping');
  web.close();
  process.exit();
});