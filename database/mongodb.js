/*
MongoDB
*/

/*
 * The database file must contain all the functions required.
 * The exports.connect = function(data) will always be run on setup.
 * Required functions are found in example.js.
 * You can copy it and edit to your needing.
 */

const utils = require("../utils.js") 

const mongoose = require("mongoose")
const Schema = mongoose.Schema;

// Create schemas

const UserSchema = new Schema({
  username: String,
  id: Number,
  password: String,
  created: {type: Date, default: Date.now},
  role: Number,
  firstname: {type: String, default:"Etunimi"},
  lastname: {type: String, default:"Sukunimi"}
});
const User = mongoose.model('User',UserSchema);



exports.connect = async function(data) {
  // Connecting to the mongodb database
  mongoose.connect(data.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
  /*var i = new User({ username: 'roni.aikas', id: 0, password: utils.encrypt("salasana"), role:0 });

  // Save the new model instance, passing a callback
  i.save(function (err) {
    if (err) {  console.log(err); return; }
    console.log("saved")
  });*/
}

exports.newAccount = function(username, password){
  return {username, id, password: utils.encrypt(password)}
}

/* boolean : If username and password set is correct return true, otherwise false */
exports.validate = function(user, password) {
}

/* boolean : Does user exist */
exports.validateUsername = async function(username) {
  return new Promise((resolve, reject) => {
    User.findOne({username}, function(err, user) {
      if(err) { resolve(false); return; }
      if(user) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
});
}

/* string : Generate a account token (based on password, username) and returning it.
Default ritta databasetypes use following:
encryptedUsername:encryptedEncryptedPassword:Date.now()*/
exports.generateAccountToken = function(user, password) {
}

/* string: Generate a token for opinsys use and return it */
exports.opinsysToken = function(user) {
  
}

/* boolean: Set user password, first verify with oldPassword, if oldPassword wrong, return false, if password change succesful, return true */
exports.setPassword = function(user, oldPassword, newPassword) {
}

/* Object: Return user data by username */
exports.getUserData = function(username) {
  
}

/* boolean: Verify loggedintoken, if valid return true and if not return false */
exports.isLoggedInByToken = function(token) {
  
}
