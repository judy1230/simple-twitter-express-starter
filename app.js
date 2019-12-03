const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {      // 如果不是 production 模式
	require('dotenv').config()                      // 使用 dotenv 讀取 .env 檔案
}
const passport = require('./config/passport.js')

//setup handlebars
app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	helpers: require('./config/handlebars-helpers.js')
}))

app.set('view engine', 'handlebars')
//setup bodyParser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
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
//require('./routes')(app, passport)
require('./routes')(app)
app.use('/upload', express.static(__dirname + '/upload'))
