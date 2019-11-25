const express = require('express')
const bodyParser = require('body-parser')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');
const helpers = require('./_helpers');

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize(), passport.session());
app.use(flash(), (req, res) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user;
  next();
});

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
