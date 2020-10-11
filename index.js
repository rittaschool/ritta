// NPMJS Modules
const express = require("express");
const session = require("express-session")
const fileStore = require("session-file-store")(session)

// Local modules
const database = require("./databaseManager.js")
const utils = require("./utils.js")

// Remove the useless part of argv
process.argv = process.argv.slice(2);


// Debug mode
const debugMode = process.argv.includes("debug")

// Custom console.log
console.log = function(d = "") {
  process.stdout.write("Ritta » " + d + '\n');
}
console.debug = function(d = "") {
  if(debugMode) process.stdout.write("Debug » " + d + '\n');
}

// Enabled message
if(debugMode) {
  console.debug("Debug mode enabled")
}

// Events

process.on('exit', function(code) {
  return console.log(`Ritta stopping with exit code ${code}`);
});

process.on('SIGINT', function() {
    console.log("Control-C detected. Stopping");
    server.close();
    process.exit();
});

// Custom redirect using js, because the express one breaks things
function redirect(res, url) {
  res.send('<script>window.location.replace("'+url+'");</script>')
}
// Start

let config;
try {
  config = require("./config.json")
} catch(e) {
  console.log("Config file not found. Rename config.json.example to config.json")
  process.exit()
}
let lang;
try {
  lang = require(config.langFile)
} catch(e) {
  console.log("Lang file not found. Check your config.")
  process.exit()
}

/*
 *
 * WEB
 *
 */

const app = express();

app.set('trust proxy', 1)
app.set('view engine', 'ejs');

app.use(session({
  genid: function(req) {
    return utils.genUUID()
  },
  secret: config.encryptionKey,
  store: new fileStore({}),
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000, secure: false, test:"true" }
}))
app.use(function (req, res, next) {
  console.debug(`${req.originalUrl} pinged`)
  next()
})
app.use(express.static("assets"))

app.get("/", (req, res) => {
  if(req.session.account) {
    if(database.isLoggedInByToken(req.session.account.token)) {
      // Home page
      res.send('logged in<br><a href="/account/logout">Log out</a>')
      return;
    } else {
      utils.setAccount(req, undefined)
    }
  }
  redirect(res,"/account/login")
  //res.send("Redirect -> /login")
})
app.get("/check", (req,res)=>{
  res.json(req.session)
})
app.get("/account/:action", (req,res)=>{
  switch(req.params.action.toLowerCase()) {
    case 'login':
      console.debug("login page")
      if(req.session.account) {
        if(database.isLoggedInByToken(req.session.account.token)) {
          //res.send("is logged in <3")
          console.debug("User is logged in, redirect")
          redirect(res,"/")
          return;
        } else {
          utils.setAccount(req, undefined)
        }
      }
      res.render(__dirname + "/web/loginpage.ejs", {lang: lang})
      break;
    case 'logout':
      console.debug("logout page")
      utils.setAccount(req, undefined)
      console.debug("Log out succesfull, redirect")
      redirect(res,"/account/login?loggedout")
      break;
    case 'process':
      utils.setAccount(req, {token: "shit"})
      //(res.send("Logged in")
      redirect(res, "/")
      break;
    default:
      res.status(404).send("Not found")
      break;
  }
})
const server = app.listen(config.website.port, function() {
  console.log("Website is now running on port " + config.website.port)
})
