const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpersreq = require('../_helpers')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy



let userController = {
	signUpPage: (req, res) => {
		return res.render('signup')
	},
	signUp: (req, res) => {
		//confirm password
		if (req.body.passwordCheck !== req.body.password) {
			req.flash('error_msg', '兩次密碼輸入不同!')
			return res.redirect('/signup')
		} else {
			//confirm unique user
			User.findOne({ where: { email: req.body.email } }).then(user => {
				if (user) {
					req.flash('error_msg', '信箱重複')
					return res.redirect('/signup')
				} else {
					User.create({
						name: req.body.name,
						email: req.body.email,
						password: bcrypt.hashSync(req.body.password,
							bcrypt.genSaltSync(10), null)
					}).then(user => {
						req.flash('success_msg', '成功註冊帳號!')
						return res.redirect('/signin')
					})
				}
			})
		}
	},
	signInPage: (req, res) => {
		return res.render('signin')
	},
	signIn: (req, res) => {
		req.flash('success_msg', '成功登入!')
		res.redirect('/tweets')
	},
	logout: (req, res) => {
		req.flash('success_msg', '成功登出!')
		req.logout()
		res.redirect('/signin')
	},
	getUser: (req, res) => {
		return User.findByPk(req.params.id, {
			order: [
				[Tweet, 'createdAt','DESC']
			],
			include: [
				//get user.Tweets include replies
				{ model: Tweet,
					include: [
						{ model: User, as: 'LikedUsers' },
						Reply,
					],
				},
				//get user's tweets replies
				{ model: Reply, include: Tweet },
				{ model: Tweet, as: 'LikedTweets' },
				{ model: User, as: 'Followers' },
				{ model: User, as: 'Followings' }
			]
		})
			.then((user) => {
				//console.log('helpersreq.getUser(req)', helpersreq.getUser(req))
				const isFollowed = helpersreq.getUser(req).Followings ? helpersreq.getUser(req).Followings.map(d => d.id).includes(user.id) : false
				return res.render('profile', {
					profile: user,
					localUser: helpersreq.getUser(req),
					isFollowed
				})
			})
	},
	addLike: (req, res) => {
		return Like.create({
			UserId: helpersreq.getUser(req).id,
			TweetId: req.params.id
		})
			.then((tweet) => {
				return res.redirect('/tweets')
			})
	},
	removeLike: (req, res) => {
		return Like.findOne({
			where: {
				UserId: helpersreq.getUser(req).id,
				TweetId: req.params.id
			}
		}).then((like) => {
			like.destroy()
				.then((like) => {
					return res.redirect('/tweets')
				})
		})

	},
	addFollowing: (req, res) => {

		if (helpersreq.getUser(req).id == req.body.id) {
			return res.redirect('/tweets')
		}
		return Followship.create({
			followerId: helpersreq.getUser(req).id,
			followingId: req.body.id
		})
			.then(() => {
				return res.redirect('/tweets')
			})
	},

	removeFollowing: (req, res) => {
		return Followship.findOne({
			where: {
				followerId: helpersreq.getUser(req).id,
				followingId: req.params.id
			}
		})
			.then((followship) => {
				followship.destroy()
					.then((followship) => {
						return res.redirect('/tweets')
					})
			})
	}
}

module.exports = userController
