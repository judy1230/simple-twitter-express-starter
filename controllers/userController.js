const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const Like = db.Like


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
				{ model: Tweet,
					include: [
						{ model: User, as: 'LikedUsers' },
						Reply,
					],
				},
				{ model: Reply, include: Tweet },
				{ model: Tweet, as: 'LikedTweets' },
				{ model: User, as: 'Followers' },
				{ model: User, as: 'Followings' }
			]
		})
			.then((user) => {
				//user.Tweets.findAll({ order: [['createdAt', 'ASC']],})
				console.log('user.Tweets', user.Tweets)
				const isFollowed = user.Followings.map(d => d.id).includes(user.id)
				return res.render('profile',{ profile: user, isFollowed: isFollowed })
			})
	},
	addLike: (req, res) => {
		return Like.create({
			UserId: req.user.id,
			TweetId: req.params.tweetId
		})
			.then((tweet) => {
				return res.redirect('back')
			})
	},
	removeLike: (req, res) => {
		return Like.findOne({
			where: {
				UserId: helpersreq.getUser(req).id,
				TweetId: req.params.tweetId
			}
		}).then((like) => {
			like.destroy()
				.then((tweet) => {
					return res.redirect('back')
				})
		})

	},
	addFollowing: (req, res) => {
		return Followship.create({
			followerId: helpers.getUser(req),
			followingId: req.params.userId
		})
			.then((followship) => {
				return res.redirect('back')
			})
	},

	removeFollowing: (req, res) => {
		return Followship.findOne({
			where: {
				followerId: helpers.getUser(req),
				followingId: req.params.userId
			}
		})
			.then((followship) => {
				followship.destroy()
					.then((followship) => {
						return res.redirect('back')
					})
			})
	}
}

module.exports = userController
