/*
MongoDB
*/

/*
 * The database file must contain all the functions required.
 * The exports.connect = function(data) will always be run on setup.
 * Required functions are found in example.js.
 * You can copy it and edit to your needing.
 */

const mongoose = require('mongoose');
const xss = require('xss');
const utils = require('./utils.js');

const { Schema } = mongoose;

// Create schemas

const UserSchema = new Schema({
  username: String,
  password: String,
  created: { type: Number, default: Date.now },
  role: Number,
  firstName: { type: String, default: 'Etunimi' },
  lastName: { type: String, default: 'Sukunimi' },
});
const MessageSchema = new Schema({
  sender: Schema.Types.ObjectId, // Sender of this message,
  created: { type: Number, default: Date.now },
  content: String,
});
const MessageThreadSchema = new Schema({
  name: String,
  sender: Schema.Types.ObjectId, // The original first sender of the thread
  recipients: [{
    userId: {
      type: Schema.Types.ObjectId,
    },
    read: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  }], // All recipients that have not deleted
  messages: [Schema.Types.ObjectId], // All messages tied to this thread
  created: { type: Number, default: Date.now },
});
// Models
const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);
const MessageThread = mongoose.model('MessageThread', MessageThreadSchema);

exports.models = {
  User,
  Message,
  MessageThread,
};

exports.connect = async () => {
  // Connecting to the mongodb database
  mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }).then(() => console.log('MongoDB connection succesful')).catch((err) => {
    console.log(`MongoDB connection failed. Exiting.\nError:\n${err}`);
    process.exit();
  });
};

exports.newMessage = (senderID, content, threadID) => new Promise((resolve) => {
  if (!senderID || !content || !threadID) resolve(false);
  const messageContent = xss(content);
  const message = new Message(
    { sender: senderID, content: utils.encrypt(messageContent), created: Date.now() },
  );
  MessageThread.findOne({ _id: threadID }, (err, thread) => {
    if (err) { resolve(false); return; }
    if (!thread) { resolve(false); return; }
    thread.messages.push(message.id);
    message.save((err1) => {
      if (err1) { console.debug(err1); resolve(false); return; }
      console.debug(`Message ${message.id} saved`);
    });
    thread.save((err2) => {
      if (err2) { console.debug(err2); resolve(false); return; }
      console.debug(`Thread ${thread.id} saved`);
    });
    resolve(thread.id);
  });
});

exports.newThread = (senderID, title, content, recipients) => new Promise((resolve) => {
  if (!senderID || !content || !recipients) resolve(false);
  const messageContent = content; // Used to do XSS here
  const message = new Message({ sender: senderID, content: utils.encrypt(messageContent) });
  const newRecipients = [];
  recipients.forEach((id) => {
    if (id === senderID) return;
    newRecipients.push({ userId: id, archived: false, read: false });
  });
  if (newRecipients.length === 0) {
    resolve(false);
    return;
  }
  const thread = new MessageThread({
    name: title,
    sender: senderID,
    recipients: newRecipients,
    messages: [message],
    created: Date.now(),
  });
  message.save((err) => {
    if (err) { console.debug(err); resolve(false); }
    console.debug(`Message ${message.id} saved`);
  });
  thread.save((err) => {
    if (err) { console.debug(err); resolve(false); }
    console.debug(`Thread ${thread.id} saved`);
  });
  resolve(thread.id);
});

exports.getMessagesInbox = (username) => new Promise((resolve) => {
  exports.getUserData(username).then((user) => {
    if (!user) {
      resolve([]);
    }
    MessageThread.find({}, (err, res) => {
      const messages = [];
      if (err || !res) {
        resolve(messages);
        return;
      }
      res.forEach((response) => {
        const response2 = response.toObject();
        const recipients = [];
        response.recipients.forEach((recipient) => {
          recipients.push(recipient.userId.toString());
        });
        if (!recipients.includes(user.id)) return;
        response2.userRecipientData = response.recipients.find(
          (r) => r.userId.toString() === user.id,
        ).toObject();
        messages.push(response2);
      });
      resolve(messages);
    });
  });
});

exports.getMessagesSent = (username) => new Promise((resolve) => {
  exports.getUserData(username).then((user) => {
    if (!user) {
      resolve([]);
    }
    MessageThread.find({}, (err, res) => {
      const messages = [];
      if (err || !res) {
        resolve(messages);
        return;
      }
      res.forEach((response) => {
        const response2 = response.toObject();
        if (response.sender.toString() !== user.id) return;
        messages.push(response2);
      });
      resolve(messages);
    });
  });
});

exports.getMessagesArchive = (username) => new Promise((resolve) => {
  exports.getMessagesInbox(username).then((messages) => {
    const archivedMessages = [];
    messages.forEach((message) => {
      if (message.userRecipientData.archived) {
        archivedMessages.push(message);
      }
    });
    resolve(archivedMessages);
  });
});

exports.getThread = (id) => new Promise((resolve) => {
  MessageThread.findById(id, (err, user) => {
    if (err) {
      resolve(false);
    }
    resolve(user);
  });
});

exports.getMessage = (id) => new Promise((resolve) => {
  Message.findById(id, (err, user) => {
    if (err) {
      resolve(false);
    }
    resolve(user);
  });
});

exports.newAccount = (username, password, role = 0) => {
  const i = new User(
    {
      username, password: utils.encrypt(utils.hash(password)), role, created: Date.now(),
    },
  );

  // Save the new model instance, passing a callback
  i.save((err) => {
    if (err) { console.debug(err); return; }
    console.debug('New account saved');
  });
  return { username };
};

/* Promise(=>boolean) : If username and password set is correct return true, otherwise false */
exports.validate = (username, password) => new Promise((resolve) => {
  exports.validateUsername(username).then((userValid) => {
    if (!userValid) {
      resolve(false);
      return;
    }
    exports.getUserData(username).then((user) => {
      resolve(utils.decrypt(user.password) === utils.hash(password));
    });
  });
});

/* Promise(=>boolean) : Does user exist */
exports.validateUsername = async (username) => new Promise((resolve) => {
  User.findOne({ username }, (err, user) => {
    if (err) { resolve(false); return; }
    if (user) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
});

/* boolean: Set user password, first verify with oldPassword,
 * if oldPassword wrong, return false, if password change succesful, return true
*/
exports.setPassword = (username, oldPassword, newPassword) => new Promise((resolve) => {
  exports.validate(username, oldPassword).then((valid) => {
    if (valid) {
      User.replaceOne({ username }, { password: newPassword }, {}, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    } else {
      resolve(false);
    }
  });
});

/* Promise(=>Object): Return user data by username */
exports.getUserData = (username) => new Promise((resolve) => {
  User.findOne({ username }, (err, user) => {
    if (err) { resolve(false); return; }
    if (user) {
      resolve(user);
    } else {
      resolve(null);
    }
  });
});

/* Promise(=>Object): Return user data by id */
exports.getUserDataById = (id) => new Promise((resolve) => {
  User.findOne({ _id: id }, (err, user) => {
    if (err) { resolve(false); return; }
    if (user) {
      resolve(user);
    } else {
      resolve(null);
    }
  });
});
