// NPMJS Modules
const express = require("express"),
      session = require("express-session"),
      cors = require("cors"),
      fileStore = require("session-file-store")(session),
      bodyParser = require("body-parser"),
      https = require("https"),
      fs = require("fs"),
      crypto = require("crypto"),
      rateLimit = require("express-rate-limit"),
      jwt = require("njwt"),
      csrf = require("csurf"),
      cookieParser = require('cookie-parser'),
      helmet = require("helmet"),
      passport = require("passport"),
      OpinsysStrategy = require("passport-opinsys"),
      xss = require("xss"),
      LocalStrategy = require("passport-local");

// Local modules
let database;

// Remove the useless part of argv
process.argv = process.argv.slice(2);


// Debug mode
const debugMode = process.argv.includes("debug");

// Custom console.log
console.log = (d = "") => {
  process.stdout.write("Ritta » " + d + '\n');
}
console.debug = (d = "") => {
  if(debugMode) process.stdout.write("Debug » " + d + '\n');
}

// Enabled message
if(debugMode) console.debug("Debug mode enabled")

// Events

process.on('exit', function(code) {
  return console.log(`Ritta stopping with exit code ${code}`);
});

process.on('SIGINT', function() {
    console.log("Control-C detected. Stopping");
    server.close();
    process.exit();
});

// Start

let config;
try {
  config = require("./config.js")
} catch(e) {
  console.log("Config file not found. Rename config.js.example to config.js")
  process.exit()
}
let lang;
try {
  lang = require(config.langFile)
} catch(e) {
  console.log("Lang file not found. Check your config.")
  process.exit()
}
try {
  database = require("./database/"+config.databaseType+".js")
} catch(e) {
  console.debug(e)
  console.log("Database file not found, or there was a error. Check your config.")
  process.exit()
}
database.connect(config.database)

const utils = require("./utils.js")
const packageJSON = require("./package.json")

// Opinsys
const opinsys = config.opinsys.enabled;
const opinsys_organization = config.opinsys.organization;
const opinsys_redirect = config.opinsys.redirectURI;
const opinsys_secret = config.opinsys.secret;

// Register passport strategies!
passport.use(new LocalStrategy(
  function(username, password, done) {
    database.validate(username, password).then(isValid=>{
      if(isValid) {
        database.getUserData(username).then(user => {
          done(null, user)
        })
      } else {
        done(null, false, { message: "invalid" });
      }
    })
      
  }
));

if(opinsys) {
  passport.use(new OpinsysStrategy (
    {
        redirectURI: opinsys_redirect,
        secret: opinsys_secret,
        organization: opinsys_organization
    },
    function(profile, done) {
        if(profile.organisation_domain !== opinsys_organization) {
          done(null, false, { message: "opinsysinvalidorganization" })
          return;
        }
        database.validateUsername(profile.username).then((usernameValid)=>{
          if(usernameValid) {
            database.getUserData(profile.username).then(user => {
              done(null, user)
            })
          } else {
            done(null, false, { message: "opinsysaccountnone" });
          }
        })
    }
));
}

// Setup session

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
 
passport.deserializeUser(function(id, done) {
  database.getUserData(id).then(user=>{
    done(false, user);
  })
});

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
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 3600000, secure: true }
}))
app.use(cookieParser())
app.use(cors());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 100,
  max: 40,
  handler: function (req, res, next) {
    if(req.path.endsWith(".css") || req.path.endsWith(".js") || req.path.endsWith(".png") || req.path.endsWith(".jpg") || req.path.endsWith(".jpeg") || req.path.endsWith(".svg")) { next(); return; }
    res.status(429).send("Wait a bit... <script>setTimeout(()=>{window.location.replace('"+req.originalUrl+"')},1150)</script>");
  },
});
app.use(limiter)
app.use(function (req, res, next) {
  console.debug(`${req.originalUrl} pinged`)
  next()
})
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("assets"))
app.use(passport.initialize());
app.use(passport.session());
// Anti CSRF
app.use(csrf({ cookie: true }));

app.get("/", (req, res) => {
  if(req.user) {
    res.render(__dirname + "/web/homepage.ejs", {version: packageJSON.version, lang: lang, school: config.school, username: req.user.username, user: req.user})
  } else {
    res.redirect("/account/login")
  }
})

app.post("/messages/send", (req, res) => {
  if(req.user) {
    res.json({body: req.body, query: req.query})
  } else {
    res.redirect("/account/login")
  }
})

app.get("/messages/send", (req, res) => {
  if(req.user) {
    res.render(__dirname + "/web/sendmessage.ejs", {version: packageJSON.version, lang: lang, school: config.school, username: req.user.username, user: req.user, csrfToken: req.csrfToken()})
  } else {
    res.redirect("/account/login")
  }
  //res.send("Redirect -> /login")
})

app.get("/account/opinsys", passport.authenticate("opinsys", {failureRedirect: "/account/login?opinsysaccountnone",successRedirect:"/"}))

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy(function (err) {});
  setTimeout(()=>{res.redirect("/account/login?loggedout")},200)
})
app.get("/account/:action", (req,res)=>{
  switch(req.params.action.toLowerCase()) {
    case 'createuser':
      database.newAccount("opiskelija.ritta","deeb8Too")
      res.redirect( "/")
      return;
    case 'login':
      if(req.user) {
        res.redirect("/")
        return;
      }
      let error;
      if(req.query.hasOwnProperty("invalid")) {
        error = lang.error_login;
      } else if(req.query.hasOwnProperty("loggedout")){
        error = lang.loggedout;
      } else if(req.query.hasOwnProperty("opinsysaccountnone")){
        error = lang.opinsys_account_none;
      } else if(req.query.hasOwnProperty("opinsysinvalidorganization")){
        error = lang.opinsys_organization_invalid;
      }
      res.render(__dirname + "/web/loginpage.ejs", {lang: lang, school: config.school, opinsys: config.opinsys, error: error, csrfToken: req.csrfToken()})
      break;
    case 'loggedin':
      res.redirect( "/")
      break;
    default:
      res.status(404).send("Not found GET /account/:action")
      break;
  }
})

app.post("/account/process", passport.authenticate("local", { failureRedirect: '/account/login?invalid', successRedirect: "/" }))

app.post("/account/:action", (req,res)=>{
  switch(req.params.action.toLowerCase()) {
    default:
      res.status(404).send("Not found POST /account/:action")
      break;
  }
})
app.post("/api/:action", (req,res)=>{
  switch(req.params.action.toLowerCase()) {
    default:
      res.status(404).send("Not found POST /account/:action")
      break;
  }
})
app.get("/api/calendar/:userid", (req,res)=>{
  req.rateLimitThis = true;
  let value = utils.createCalendar([{
    title: 'Saksa',
    start: [2020, 10, 12, 22, 15],
    duration: { minutes: 45 }
  },
  {
    title: 'Englanti',
    start: [2020, 10, 12, 21, 15],
    duration: { minutes: 45 }
  }])
  if(!value) {
    res.send("Error")
    return;
  }
  let id = crypto.randomBytes(20).toString('hex').substring(0, 4);
  fs.writeFileSync(`${__dirname}/${id}.ics`, value)
  res.sendFile(`${__dirname}/${id}.ics`, {}, function (err) {
    if (err) {
      next(err)
    } else {
      console.debug(`${id}.ics was sent`)
      try {
        fs.unlinkSync(`${__dirname}/${id}.ics`)
        console.debug(`File ${id}.ics removed`)
      } catch(err) {
        console.debug(err)
      }
    }
  })

})
let server;
if(config.ssl.enabled) {
  var privateKey = fs.readFileSync( config.ssl.key );
  var certificate = fs.readFileSync( config.ssl.cert );
  
  server = https.createServer({
      key: privateKey,
      cert: certificate
  }, app).listen(config.website.port, function() {
    console.log("Website is now running on port " + config.website.port)
  });
} else {
  server = app.listen(config.website.port, function() {
    console.log("Website is now running on port " + config.website.port)
  })
}
