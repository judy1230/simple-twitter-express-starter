const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport.js')
const methodOverride = require('method-override')
const port = process.env.PORT || 3000
//setup handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//setup bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
//setup session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
//setup passport
app.use(passport.initialize())
app.use(passport.session())
//setup flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user
  next()
})

app.use(methodOverride('_method'))
//listen to port:3000
app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Example app listening on port ${port}!`)
})
//把 passport 傳入routes
require('./routes')(app, passport)

app.use('/upload', express.static(__dirname + '/upload'))

module.exports = app
