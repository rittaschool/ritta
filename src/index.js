/* eslint-disable import/no-dynamic-require */
// NPMJS Modules
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const passport = require('passport');
const OpinsysStrategy = require('passport-opinsys');
const moment = require('moment');
const { Strategy, GoogleAuthenticator } = require('passport-2fa-totp-v2');
const WebSocket = require('ws');

require('dotenv').config();

// Local modules
let lang;
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

const config = {
  school: {
    multiSchool: process.env.SCHOOL_MULTISCHOOL,
    name: process.env.SCHOOL_NAME,
    city: process.env.SCHOOL_CITY,
  },
  lang: process.env.LANGUAGE,
  ssl: {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT,
  },
  opinsys: { // Opinsys
    enabled: process.env.OPINSYS_ENABLED,
    organization: process.env.OPINSYS_ORGANIZATION,
    redirectURI: process.env.OPINSYS_REDIRECTURI,
    secret: process.env.OPINSYS_SECRET,
  },
};

try {
  lang = require(`../lang/${config.lang}/lang.json`);
} catch (e) {
  console.log('Language file not found. Check your config');
  process.exit();
}
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

const utils = require('./utils.js');
const packageJSON = require('../package.json');

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
    const secret = GoogleAuthenticator.decodeSecret(user.secret);
    done(null, secret, 30);
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

// Notification server.

const wss = new WebSocket.Server({
  noServer: true,
});

const userNotificationMap = {};

wss.on('connection', (ws, request, client) => {
  ws.on('message', (message) => {
    // const json = JSON.parse(message);
    console.log(`youve got mail "${message}" from ${client}`);
  });

  ws.send(JSON.stringify({ status: 1, message: 'Connected.' }));
});

/*
 *
 * WEB
 *
 */

const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');

app.use(session({
  genid() {
    return utils.genUUID();
  },
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000, secure: true },
}));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(express.json({ limit: '200mb' }));
app.use(express.static('assets'));
app.use(passport.initialize());
app.use(passport.session());

// Anti CSRF
app.use(csrf({ cookie: true }));

const isAllowedToAccess = (req, res, next, roles) => {
  if (!Array.isArray(roles)) {
    next();
  }
  if (!req.user) {
    res.redirect('/account/login');
    return;
  }
  if (roles.length !== 0 && !roles.includes(req.user.role)) {
    const error = new Error('Your role is not allowed to access this page.');
    error.code = 403;
    throw error;
  }
  next();
};

app.get('/', (req, res, next) => isAllowedToAccess(req, res, next, []), (req, res) => {
  if (req.user.role === 0) {
    res.render(`${__dirname}/web/guest.ejs`, {
      version: packageJSON.version,
      lang,
      school: config.school,
      username: req.user.username,
      user: req.user,
      notificationID: utils.encrypt(req.user.id),
    });
    return;
  }
  res.render(`${__dirname}/web/homepage.ejs`, {
    version: packageJSON.version,
    lang,
    school: config.school,
    username: req.user.username,
    user: req.user,
    notificationID: utils.encrypt(req.user.id),
  });
});

app.get('/messages', (req, res, next) => isAllowedToAccess(req, res, next, [0]), (req, res) => {
  // We have to do a lot of the work here as the engine can't do everything
  database.getMessagesSent(req.user.username).then((sent) => {
    database.getMessagesArchive(req.user.username).then((archive) => {
      database.getMessagesInbox(req.user.username).then((plainMessages) => {
        new Promise((resolve) => {
          let amount = 0;
          const messages = [];
          if (plainMessages.length === 0) resolve([]);
          plainMessages.forEach((message) => {
            const newMessage = message;
            database.getUserDataById(message.sender).then((user) => {
              newMessage.senderObject = user;
              messages.push(newMessage);
              amount += 1;
              if (plainMessages.length === amount) resolve(messages);
            });
          });
        }).then((messages) => {
          res.render(`${__dirname}/web/messages.ejs`, {
            version: packageJSON.version,
            lang,
            school: config.school,
            username: req.user.username,
            user: req.user,
            messages,
            moment,
            sent: sent.length,
            archive: archive.length,
            notificationID: utils.encrypt(req.user.id),
          });
        });
      });
    });
  });
});

app.get('/messages/sent', (req, res, next) => isAllowedToAccess(req, res, next, [0]), (req, res) => {
  // We have to do a lot of the work here as the engine can't do everything
  database.getMessagesArchive(req.user.username).then((archive) => {
    database.getMessagesInbox(req.user.username).then((outbox) => {
      database.getMessagesSent(req.user.username).then((plainMessages) => {
        new Promise((resolve) => {
          let amount = 0;
          const messages = [];
          if (plainMessages.length === 0) resolve([]);
          plainMessages.forEach((message) => {
            const newMessage = message;
            database.getUserDataById(message.sender).then((user) => {
              newMessage.senderObject = user;
              messages.push(newMessage);
              amount += 1;
              if (plainMessages.length === amount) resolve(messages);
            });
          });
        }).then((messages) => {
          res.render(`${__dirname}/web/messagesSent.ejs`, {
            version: packageJSON.version,
            lang,
            school: config.school,
            username: req.user.username,
            user: req.user,
            messages,
            moment,
            outbox: outbox.length,
            archive: archive.length,
            notificationID: utils.encrypt(req.user.id),
          });
        });
      });
    });
  });
});

app.get('/messages/archive', (req, res, next) => isAllowedToAccess(req, res, next, [0]), (req, res) => {
  // We have to do a lot of the work here as the engine can't do everything
  database.getMessagesSent(req.user.username).then((sent) => {
    database.getMessagesInbox(req.user.username).then((outbox) => {
      database.getMessagesArchive(req.user.username).then((plainMessages) => {
        new Promise((resolve) => {
          let amount = 0;
          const messages = [];
          if (plainMessages.length === 0) resolve([]);
          plainMessages.forEach((message) => {
            const newMessage = message;
            database.getUserDataById(message.sender).then((user) => {
              newMessage.senderObject = user;
              messages.push(newMessage);
              amount += 1;
              if (plainMessages.length === amount) resolve(messages);
            });
          });
        }).then((messages) => {
          res.render(`${__dirname}/web/messagesArchive.ejs`, {
            version: packageJSON.version,
            lang,
            school: config.school,
            username: req.user.username,
            user: req.user,
            messages,
            moment,
            outbox: outbox.length,
            sent: sent.length,
            notificationID: utils.encrypt(req.user.id),
          });
        });
      });
    });
  });
});

app.get('/messages/send', (req, res, next) => isAllowedToAccess(req, res, next, [0]), (req, res) => {
  res.render(`${__dirname}/web/sendmessage.ejs`, {
    version: packageJSON.version,
    lang,
    school: config.school,
    username: req.user.username,
    user: req.user,
    csrfToken: req.csrfToken(),
    notificationID: utils.encrypt(req.user.id),
  });
});

app.post('/messages/send', (req, res, next) => isAllowedToAccess(req, res, next, [0]), async (req, res, next) => {
  if (!req.body.content || !req.body.recipients || !req.body.title) {
    const error = new Error('Content-parameter missing');
    error.code = 400;
    next(error);
    return;
  }
  new Promise((resolve) => {
    const recipients = [];
    let processed = 0;
    let recipientsArray = req.body.recipients.split(';');
    recipientsArray = recipientsArray.filter((c, index) => recipientsArray.indexOf(c) === index);
    recipientsArray.forEach(((recipient) => {
      database.getUserData(recipient).then((user) => {
        if (!user) {
          processed += 1;
          return;
        }
        recipients.push(user.id);
        processed += 1;
        if (processed === recipientsArray.length) resolve(recipients);
      });
    }));
  }).then((recipients) => {
    database.newThread(req.user.id, req.body.title, req.body.content, recipients).then((thread) => {
      if (!thread) {
        const error = new Error('Recipient list empty');
        error.code = 400;
        next(error);
        return;
      }
      res.redirect(`/messages/${thread}`);
    });
  });
});

app.get('/messages/:messageid', (req, res, next) => isAllowedToAccess(req, res, next, [0]), (req, res, next) => {
  database.getThread(req.params.messageid).then((thread) => {
    if (!thread) {
      const error = new Error('Thread not found');
      error.code = 404;
      next(error);
      return;
    }
    if (
      thread.sender === req.user.id
      || thread.recipients.find(r => r.userId === req.user.id)
    ) {
      const newThread = thread.toObject();
      database.getUserDataById(thread.sender).then((user) => {
        if (!user) {
          const error = new Error('Sender not found');
          error.code = 500;
          next(error);
          return;
        }
        newThread.senderObject = user;
        new Promise((resolve) => {
          const messages = [];
          let index = 0;
          newThread.messages.forEach((messageID) => {
            if (!database.getMessage(messageID)) {
              resolve([]);
            }
            database.getMessage(messageID).then((msg) => {
              const message = msg.toObject();
              database.getUserDataById(message.sender).then((user2) => {
                message.senderObject = user2;
                messages.push(message);
                index += 1;
                if (index === newThread.messages.length) {
                  resolve(messages.sort((a, b) => new Date(a.created) - new Date(b.created)));
                }
              });
            });
          });
        }).then((messages) => {
          res.render(`${__dirname}/web/message.ejs`, {
            version: packageJSON.version,
            lang,
            school: config.school,
            username: req.user.username,
            user: req.user,
            thread: newThread,
            moment,
            decrypt: utils.decrypt,
            messages,
            csrfToken: req.csrfToken(),
            notificationID: utils.encrypt(req.user.id),
          });
        });
      });
    } else {
      const error = new Error('No permission to access this resource');
      error.code = 403;
      next(error);
    }
  });
});

app.post('/messages/:messageid/reply', (req, res, next) => isAllowedToAccess(req, res, next, [0]), (req, res, next) => {
  database.getThread(req.params.messageid).then((thread) => {
    if (!thread) {
      const error = new Error('Thread not found');
      error.code = 404;
      next(error);
      return;
    }
    if (
      thread.sender === req.user.id
      || thread.recipients.find(r => r.userId === req.user.id)
    ) {
      if (!req.body.content) {
        const error = new Error('Content-parameter missing');
        error.code = 400;
        next(error);
        return;
      }
      database.newMessage(req.user.id, req.body.content, thread.id).then((thread2) => {
        if (!thread2) {
          const error = new Error('Error while replying');
          error.code = 400;
          next(error);
          return;
        }
        res.redirect(`/messages/${thread2}`);
      });
    } else {
      const error = new Error('No permission to access this resource');
      error.code = 403;
      next(error);
    }
  });
});

app.get('/account/opinsys', passport.authenticate('opinsys', { failureRedirect: '/account/login?opinsysaccountnone=true', successRedirect: '/' }));

app.get('/logout', (req, res, next) => isAllowedToAccess(req, res, next, [0]), (req, res) => {
  req.logout();
  req.session.destroy(() => {});
  setTimeout(() => { res.redirect('/account/login?loggedout=true'); }, 200);
});

app.get('/account/:action', (req, res) => {
  switch (req.params.action.toLowerCase()) {
    case 'createuser':
      database.newAccount('opiskelija.ritta', 'deeb8Too');
      res.redirect('/');
      return;
    case 'login': {
      if (req.user) {
        res.redirect('/');
        return;
      }
      let error;
      if (req.query.invalid) {
        error = lang.error_login;
      } else if (req.query.loggedout) {
        error = lang.loggedout;
      } else if (req.query.opinsysaccountnone) {
        error = lang.opinsys_account_none;
      } else if (req.query.opinsysinvalidorganization) {
        error = lang.opinsys_organization_invalid;
      }
      res.render(`${__dirname}/web/loginpage.ejs`, {
        lang, school: config.school, opinsys: config.opinsys, error, csrfToken: req.csrfToken(),
      });
      break;
    }
    case 'loggedin':
      res.redirect('/');
      break;
    case 'settings':
      if (!req.user) {
        res.redirect('/');
        return;
      }
      res.render(`${__dirname}/web/settings.ejs`, {
        version: packageJSON.version,
        lang,
        school: config.school,
        username: req.user.username,
        user: req.user,
        notificationID: utils.encrypt(req.user.id),
      });
      break;
    default:
      res.status(404).send('Not found GET /account/:action');
      break;
  }
});

app.post('/account/process', passport.authenticate('2fa-totp', { failureRedirect: '/account/login?invalid=true', successRedirect: '/' }));

app.post('/account/:action', (req, res) => {
  switch (req.params.action.toLowerCase()) {
    default:
      res.status(404).send('Not found POST /account/:action');
      break;
  }
});
app.post('/api/:action', (req, res) => {
  switch (req.params.action.toLowerCase()) {
    default:
      res.status(404).send('Not found POST /account/:action');
      break;
  }
});
app.get('/api/notification', (req, res) => {
  if (req.query.user) {
    if (!userNotificationMap[req.query.user]) {
      res.send('lol222');
      return;
    }
    userNotificationMap[req.query.user].forEach((ws) => {
      ws.send(req.query.notification);
    });
    res.send('sent');
  } else {
    res.send('lol');
  }
});
app.get('/api/calendar/:userid', (req, res) => {
  const value = utils.createCalendar([{
    title: 'Saksa',
    start: [2020, 10, 12, 22, 15],
    duration: { minutes: 45 },
  },
  {
    title: 'Englanti',
    start: [2020, 10, 12, 21, 15],
    duration: { minutes: 45 },
  }]);
  if (!value) {
    res.send('Error');
    return;
  }
  res.writeHead(200, { 'Content-Type': 'application/force-download', 'Content-disposition': 'attachment; filename=calendar.ics' });
  res.end(value);
});
app.all('*', (req, res) => {
  const error = new Error('Not found');
  error.code = 404;
  res.status(404).render(`${__dirname}/web/error.ejs`, {
    lang,
    error,
    school: config.school,
    version: packageJSON.version,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const status = error.code || 500;
  res.status(status).render(`${__dirname}/web/error.ejs`, {
    error,
    lang,
    school: config.school,
    version: packageJSON.version,
  });
});
let server;
if (process.env.HEROKU) {
  server = http.createServer(app);
} else {
  server = https.createServer({
    key: fs.readFileSync(`./ssl/${config.ssl.key}`),
    cert: fs.readFileSync(`./ssl/${config.ssl.cert}`),
  }, app);
}

server.listen(process.env.HEROKU ? process.env.PORT : 443, () => {
  console.log(`Ritta's web interface is now running on port ${process.env.HEROKU ? process.env.PORT : 443}`);
  if (!process.env.HEROKU) {
    const httpsRedirect = express();
    httpsRedirect.get('*', (req, res) => {
      res.redirect(`https://${req.headers.host}${req.url}`);
    });
    httpsRedirect.listen(80, () => {
      console.log('HTTPS Redirect is now running on port 80.');
    });
  }
});

server.on('upgrade', (request, socket, head) => {
  if (request.headers.upgrade !== 'websocket') {
    return;
  }
  const query = request.url.slice(request.url.indexOf('?') + 1)
    .split('&')
    .reduce((a, c) => {
      const [key, value] = c.split('=');
      const b = a;
      b[key] = value;
      return b;
    }, {});
  if (!query.id) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  // validate user
  database.getUserDataById(utils.decrypt(query.id)).then((user) => {
    if (user) {
      wss.handleUpgrade(request, socket, head, (ws) => {
        if (userNotificationMap[user.id]) {
          userNotificationMap[user.id] = userNotificationMap[user.id].push(ws);
        } else {
          userNotificationMap[user.id] = [ws];
        }
        wss.emit('connection', ws, request, user);
      });
    } else {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });
});

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
  server.close();
  process.exit();
});
