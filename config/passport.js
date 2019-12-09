const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply

//setup passport strategy
passport.use(new LocalStrategy(
  //customize user field
	{
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	//authenticate user
	(req, username, password, cb) => {
		User.findOne({ where: { email: username } }).then(user => {
			if (!user) return cb(null, false, req.flash('error_msg', '帳號或密碼輸入錯誤'))
			if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_msg', '帳號或密碼錯誤!'))
			return cb(null, user)
		})
	}
))

//serialize and deserialize user
passport.serializeUser((user, cb) => {
	cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
	User.findByPk(id, {
		include: [
			{
				model: Tweet, include: [
					{ model: User, as: 'LikedUsers' },
					Reply
				]
			},
			{ model: Reply, include: Tweet },
			{ model: Tweet, as: 'LikedTweets' },
			{ model: User, as: 'Followers' },
			{ model: User, as: 'Followings' }
		]
	}).then(user => {
		return cb(null, user)
	})
})

module.exports = passport
