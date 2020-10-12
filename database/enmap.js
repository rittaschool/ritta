/*
 * The database file must contain all the functions required.
 * The module.exports = function() will always be run on setup.
 * Required functions are found in example enmap.js.
 * You can copy it and edit to your needing.
 */
const Enmap = require("enmap");
const utils = require("../utils.js")
const users = new Enmap({name: "users"});;

exports.newAccount = function(username, password){
  users.set(username, {username: username, id: users.count, password: utils.encrypt(password)})
  return {username: username, id: users.count-1, password: utils.encrypt(password)}
}

exports.validate = function(user, password) {
  if(!users.has(user)) return false;
  if(utils.encrypt(password) !== users.get(user,"password")) return false;
  return true;
}

exports.generateAccountToken = function(user, password) {
  if(!users.has(user)) return null;
  let username = users.get(user, "username");
  const token = utils.encrypt(utils.encrypt(username) + ":"+utils.encrypt(utils.encrypt(password))+":"+Date.now())
  return token;
}

exports.setPassword = function(user, oldPassword, newPassword) {
    if(!users.has(user)) return false;
    if(users.get(user,"password") !== utils.encrypt(oldPassword)) return false;
    users.set(user,utils.encrypt(newPassword),"password")
    return true;
}

exports.isLoggedInByToken = function(token) {
  token = utils.decrypt(token);
  let split = token.split(":")
  let username = split[0];
  let password = split[1];
  username = utils.decrypt(username);
  password = utils.decrypt(password);
  if(!users.has(username)) return false;
  if(users.get(username,"password") !== password) {
    return false;
  }
  return true;
}
