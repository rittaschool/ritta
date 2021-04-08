/* eslint-disable import/no-dynamic-require */
// NPMJS Modules
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const passport = require('passport');
const OpinsysStrategy = require('passport-opinsys');
const moment = require('moment');
const LocalStrategy = require('passport-local');

require('dotenv').config();

// Local modules
let config;
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
try {
  config = require('./config.js');
} catch (e) {
  console.log('Configuration file not found. Rename config.js.example => config.js');
  process.exit();
}
try {
  lang = require(`./${config.langFile}`);
} catch (e) {
  console.log('Language file not found. Check your config');
  process.exit();
}
try {
  database = require('./database.js');
  database.connect(config.database);
} catch (e) {
  console.debug(e);
  console.log('Error loading database.');
  process.exit();
}

// Setting encryption key if not set
if (!process.env.ENCRYPTION_KEY || !process.env.SESSION_SECRET) {
  console.log('ENV Configuration is missing the encryption key or the session secret! Set the ENCRYPTION_KEY and the SESSION_SECRET');
  process.exit();
}

const utils = require('./utils.js');
const packageJSON = require('./package.json');

// Opinsys
const opinsys = config.opinsys.enabled;
const opinsysOrganization = config.opinsys.organization;
const opinsysRedirect = config.opinsys.redirectURI;
const opinsysSecret = config.opinsys.secret;

// Register passport strategies!
passport.use(new LocalStrategy(
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
const limiter = rateLimit({
  windowMs: 100,
  max: 40,
  handler(req, res, next) {
    if (req.path.endsWith('.css') || req.path.endsWith('.js') || req.path.endsWith('.png') || req.path.endsWith('.jpg') || req.path.endsWith('.jpeg') || req.path.endsWith('.svg')) { next(); return; }
    res.status(429).send(`Wait a bit... <script>setTimeout(()=>{window.location.replace('${req.originalUrl}')},1150)</script>`);
  },
});
app.use(limiter);
app.use((req, _res, next) => {
  console.debug(`/// ${req.originalUrl} pinged`);
  next();
});
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(bodyParser.json({ limit: '200mb' }));
app.use(express.static('assets'));
app.use(passport.initialize());
app.use(passport.session());
// Anti CSRF
app.use(csrf({ cookie: true }));

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect('/account/login');
    return;
  }
  next();
};

app.get('/', isLoggedIn, (req, res) => {
  res.render(`${__dirname}/web/homepage.ejs`, {
    version: packageJSON.version,
    lang,
    school: config.school,
    username: req.user.username,
    user: req.user,
  });
});

app.get('/messages', isLoggedIn, (req, res) => {
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
          });
        });
      });
    });
  });
});

app.get('/messages/sent', isLoggedIn, (req, res) => {
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
          });
        });
      });
    });
  });
});

app.get('/messages/archive', isLoggedIn, (req, res) => {
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
          });
        });
      });
    });
  });
});

app.get('/messages/send', isLoggedIn, (req, res) => {
  res.render(`${__dirname}/web/sendmessage.ejs`, {
    version: packageJSON.version,
    lang,
    school: config.school,
    username: req.user.username,
    user: req.user,
    csrfToken: req.csrfToken(),
  });
});

app.post('/messages/send', isLoggedIn, async (req, res, next) => {
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
        error.code = 403;
        next(error);
        return;
      }
      res.redirect(`/messages/${thread}`);
    });
  });
});

app.get('/messages/:messageid', isLoggedIn, (req, res, next) => {
  database.getThread(req.params.messageid).then((thread) => {
    if (!thread) {
      const error = new Error('Thread not found');
      error.code = 404;
      next(error);
      return;
    }
    if (
      thread.sender === req.user.id
      || thread.recipients.filter((r) => r.userId === req.user.id)
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

app.post('/messages/:messageid/reply', isLoggedIn, (req, res, next) => {
  database.getThread(req.params.messageid).then((thread) => {
    if (!thread) {
      const error = new Error('Thread not found');
      error.code = 404;
      next(error);
      return;
    }
    if (
      thread.sender === req.user.id
      || thread.recipients.filter((r) => r.userId === req.user.id)
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

app.get('/logout', isLoggedIn, (req, res) => {
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
    default:
      res.status(404).send('Not found GET /account/:action');
      break;
  }
});

app.post('/account/process', passport.authenticate('local', { failureRedirect: '/account/login?invalid=true', successRedirect: '/' }));

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
app.get('/api/calendar/:userid', (req, res) => {
  req.rateLimitThis = true;
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
  const id = crypto.randomBytes(20).toString('hex').substring(0, 4);
  fs.writeFileSync(`${__dirname}/${id}.ics`, value);
  res.sendFile(`${__dirname}/${id}.ics`, {}, (err) => {
    if (err) {
      console.debug(err);
    } else {
      console.debug(`${id}.ics was sent`);
      try {
        fs.unlinkSync(`${__dirname}/${id}.ics`);
        console.debug(`File ${id}.ics removed`);
      } catch (err2) {
        console.debug(err2);
      }
    }
  });
});
app.all('*', (req, res) => {
  res.status(404).render(`${__dirname}/web/error/404.ejs`, {
    lang,
    school: config.school,
    version: packageJSON.version,
  });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const status = error.code || 500;
  res.status(status).render(`${__dirname}/web/error/500.ejs`, {
    error,
    lang,
    school: config.school,
    version: packageJSON.version,
  });
});

let server;
if (config.ssl.enabled) {
  const privateKey = fs.readFileSync(config.ssl.key);
  const certificate = fs.readFileSync(config.ssl.cert);

  server = https.createServer({
    key: privateKey,
    cert: certificate,
  }, app).listen(config.website.port, () => {
    console.log(`Website is now running on port ${config.website.port}`);
  });
} else {
  server = app.listen(config.website.port, () => {
    console.log(`Website is now running on port ${config.website.port}`);
  });
}

/**
 * Load modules from modules/
 */
fs.readdir('./modules/', (err, files) => {
  if (err) console.error(err);
  console.log(`Loading ${files.length} modules.`);
  files.forEach((f) => {
    const module = require(`./modules/${f}`);
    if (!module.conf.enabled) {
      console.debug(`Module ${f} disabled, skipping...`);
      return;
    }
    console.debug(`Loading module: ${f}.`);
    if (f.start) f.start(app, database);
  });
});

// Events

process.on('exit', (code) => console.log(`Ritta stopping with exit code ${code}`));

process.on('SIGINT', () => {
  console.log('Control-C detected. Stopping');
  server.close();
  process.exit();
});
