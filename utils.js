exports.genUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
exports.setAccount = function(req, account) {
  req.session.account = account;
  req.session.save(function() {console.debug("Session saved")})
}
