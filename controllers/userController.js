const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpersreq = require('../_helpers')
const passportJWT = require('passport-jwt')




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
				[Tweet, 'createdAt', 'DESC']
			],
			include: [
				//get user.Tweets include replies
				{
					model: Tweet,
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
			.then((like) => {
				return res.redirect('back')
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
			return res.redirect('back')
		})

	},
	addFollowing: (req, res) => {
		if (helpersreq.getUser(req).id === parseInt(req.body.id)) {
			return res.redirect('/tweets')
		}
		return Followship.create({
			followerId: helpersreq.getUser(req).id,
			followingId: req.body.id
		})
			.then((followship) => {
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
	},
		//編輯資料
	editUser: (req, res) => {

		return User.findByPk(helpersreq.getUser(req).id)
			.then(user => {
			//	console.log('user', user)
				return res.render('edit', { user: user })
			})

	},
	putUser: (req, res) => {
	
		if (!req.body.name) {
			req.flash('error_messages', "name didn't exist")
			return res.redirect('back')
		}
		const { file } = req
		if (file) {
			imgur.setClientID(IMGUR_CLIENT_ID)
			imgur.upload(file.path, (err, img) => {
				return User.findByPk(helpersreq.getUser(req).id).then(user => {
					user
						.update({
							name: req.body.name,
							introduction: req.body.introduction,
							avatar: file ? img.data.link : user.avatar
						})
						.then(user => {
							req.flash('success_messages', 'user was successfully to update')
							res.redirect(`/users/${helpersreq.getUser(req).id}/tweets`)
						})
				})
		})

	 }
	 else {
			return User.findByPk(helpersreq.getUser(req).id).then(user => {
				user
					.update({
						name: req.body.name,
						introduction: req.body.introduction,
						avatar: user.avatar
					})
					.then(user => {
						req.flash('success_messages', 'user was successfully to update')
						res.redirect(`/users/${helpersreq.getUser(req).id
					}/tweets`)})
			})
	}
	},
	getFollowings: (req, res) => {
		return User.findByPk(req.params.id, {
			include: [
				{ model: User, as: 'Followings' },
				{ model: User, as: 'Followers' },
				{ model: Tweet, as: 'LikedTweets' },
				Tweet
			]
		}).then(user => {
			console.log('user.Tweets', user)
			const totalTweets = user.Tweets.length
			const totalFollowers = user.Followers.length
			const totalFollowings = user.Followings.length
			const totalLiked = user.LikedTweets.length
			const userFollowed = helpersreq.getUser(req).Followings ? helpersreq.getUser(req).Followings.map(d => d.id).includes(user.id) : false
			user.Followings = user.Followings.map(r => ({
				...r.dataValues,
				introduction: r.dataValues.introduction ? r.dataValues.introduction.substring(0, 20):r.dataValues.introduction,
				isFollowed: helpersreq.getUser(req).Followings ? helpersreq.getUser(req).Followings.map(d => d.id).includes(r.dataValues.id) : false
			})).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
			//res.set('Content-Type', 'text/html')
			return res.render('followings', {
				profile: user,
				userFollowed,
				totalLiked,
				totalFollowers,
				totalFollowings,
				totalTweets
			})
		})
	},
	getFollowers: (req, res) => {
		return User.findByPk(req.params.id, {
			include: [
				{ model: User, as: 'Followers' },
				{ model: Tweet, as: 'LikedTweets' },
				{ model: User, as: 'Followings' },
				Tweet
			]
		}).then(user => {
			const totalTweets = user.Tweets.length
			const totalLiked = user.LikedTweets.length
			const totalFollowers = user.Followers.length
			const totalFollowings = user.Followings.length
			const userFollowed = helpersreq
				.getUser(req)
				.Followings.map(d => d.id)
				.includes(user.id)
			user.Followers = user.Followers.map(r => ({
				...r.dataValues,
				introduction: r.dataValues.introduction
					? r.dataValues.introduction.substring(0, 50)
					: r.dataValues.introduction,
				isFollowed: helpersreq
					.getUser(req)
					.Followings.map(r => r.id)
					.includes(r.dataValues.id)
			})).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
			return res.render('followers', {
				profile: user,
				userFollowed,
				totalLiked,
				totalFollowers,
				totalFollowings,
				totalTweets
			})
		})
	},
	getLike: (req, res) => {
		return User.findByPk(req.params.id, {
			include: [
				{
					model: Tweet,
					include: [{ model: User, as: 'LikedUsers' }]
				},
				{
					model: Tweet,
					as: 'LikedTweets',
					include: [User, { model: User, as: 'LikedUsers' }, { model: Reply }]
				},
				{ model: User, as: 'Followers' },
				{ model: User, as: 'Followings' }
			],
			order: [[{ model: Tweet, as: 'LikedTweets' }, Like, 'createdAt', 'DESC']]
		}).then(user => {
			user.isFollowed = user.Followers.map(r => r.id).includes(
				helpersreq.getUser(req).id
			)
			const totalTweets = user.Tweets.length
			const totalLiked = user.LikedTweets.length
			const totalFollowers = user.Followers.length
			const totalFollowings = user.Followings.length
			const likedTweets = user.LikedTweets.map(tweet => ({
				...tweet.dataValues,
				isLiked: helpersreq.getUser(req).LikedTweets
					? helpersreq
						.getUser(req)
						.LikedTweets.map(d => d.id)
						.includes(tweet.id)
					: helpersreq.getUser(req).LikedTweets,
				totalLikedUsers: tweet.dataValues.LikedUsers.length,
				replyCount: tweet.dataValues.Replies.length
			}))
			return res.render('like', {
				profile: user,
				totalLiked,
				totalFollowers,
				totalFollowings,
				totalTweets,
				likedTweets
			})
		})
	},
}

module.exports = userController
