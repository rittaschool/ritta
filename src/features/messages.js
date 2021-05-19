const express = require('express');
const moment = require('moment');

const api = require('../api');
const { isAllowedToAccess, app } = require('../web');
const database = require('../database');
const packageJSON = require('../../package.json');
const lang = require('../lang').get();
const config = require('../config');
const utils = require('../utils');

const webRouter = new express.Router();
const apiRouter = new express.Router();

webRouter.get('/', (req, res, next) => isAllowedToAccess(req, res, next, [1]), (req, res) => {
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
          res.render('src/web/messages.ejs', {
            csrfToken: req.csrfToken(),
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

webRouter.get('/sent', (req, res, next) => isAllowedToAccess(req, res, next, [1]), (req, res) => {
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
          res.render('src//web/messagesSent.ejs', {
            csrfToken: req.csrfToken(),
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

webRouter.get('/archive', (req, res, next) => isAllowedToAccess(req, res, next, [1]), (req, res) => {
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
          res.render('src//web/messagesArchive.ejs', {
            csrfToken: req.csrfToken(),
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

webRouter.get('/send', (req, res, next) => isAllowedToAccess(req, res, next, [1]), (req, res) => {
  res.render('src//web/sendmessage.ejs', {
    csrfToken: req.csrfToken(),
    version: packageJSON.version,
    lang,
    school: config.school,
    username: req.user.username,
    user: req.user,
    notificationID: utils.encrypt(req.user.id),
  });
});

webRouter.get('/:messageid', (req, res, next) => isAllowedToAccess(req, res, next, [1]), (req, res, next) => {
  database.getThread(req.params.messageid).then((thread) => {
    if (!thread) {
      const error = new Error('Thread not found');
      error.code = 404;
      next(error);
      return;
    }
    console.log(typeof thread.sender);
    console.log(typeof req.user.id);
    console.log(thread.sender.toString() === req.user.id);
    console.log(thread.recipients.find(r => r.userId.toString() === req.user.id));
    if (
      thread.sender.toString() === req.user.id
      || thread.recipients.find(r => r.userId.toString() === req.user.id)
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
          res.render('src//web/message.ejs', {
            csrfToken: req.csrfToken(),
            version: packageJSON.version,
            lang,
            school: config.school,
            username: req.user.username,
            user: req.user,
            thread: newThread,
            moment,
            decrypt: utils.decrypt,
            messages,
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

apiRouter.post('/send', (req, res, next) => isAllowedToAccess(req, res, next, [1]), async (req, res, next) => {
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

apiRouter.post('/reply', (req, res, next) => isAllowedToAccess(req, res, next, [1]), (req, res, next) => {
  if (!req.body.messageId) {
    const error = new Error('MessageID missing');
    error.code = 400;
    throw error;
  }
  database.getThread(req.body.messageId).then((thread) => {
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

app.use('/messages', webRouter);
api.add('/messages', apiRouter);

