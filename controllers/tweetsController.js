const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const pageLimit = 4
const Followship = db.Followship
const helpersreq = require('../_helpers')


const tweetsController = {
	getTweets: async (req, res) => {
		let offset = 0
		let whereQuery = {}

		try {
			users = await User.findAll({
				include: [
					{ model: User, as: 'Followers' },
				]
			}).then(users => {
				return users.map(user => ({
					...user.dataValues,
					FollowerCount: user.Followers.length,
					isFollowed: helpersreq.getUser(req).Followings.map(d => d.id)
						.includes(user.id),
				}))
			})
			tweets = await Tweet.findAndCountAll({
				include: [
					User,
					{ model: User, as: 'LikedUsers' },
					Reply
				],
				where: whereQuery, offset: offset, limit: pageLimit
			})
				.then(result => {
					//console.log('result', result)
					let page = Number(req.query.page) || 1
					let pages = Math.ceil(result.count / pageLimit)
					let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
					let prev = page - 1 < 1 ? 1 : page - 1
					let next = page + 1 > pages ? pages : page + 1
					//clean up restaurant data
					const data = result.rows.map(r => ({
						...r.dataValues,
						description: r.dataValues.description.substring(0, 50),
						isLiked: helpersreq.getUser(req).LikedTweets.map(d => d.id).includes(r.id)
					}))
					return { data, page, pages, totalPage, prev, next}
				})
			console.log('tweets.User', tweets.data)
			return res.render('tweets', {
				users,
				tweets: tweets.data,
				page: tweets.page,
				totalPage: tweets.totalPage,
				prev: tweets.prev,
				next: tweets.next
			})


			// localUser = await User.findByPk( helpersreq.getUser(req).id, {
			// 	order: [
			// 		[Tweet, 'createdAt', 'DESC']
			// 	],
			// 	include: [
			// 		{
			// 			model: Tweet,
			// 			include: [
			// 				{ model: User, as: 'LikedUsers' },
			// 				{ model: Reply, include: Tweet },
			// 			],
			// 		},
			// 	]

			// 	})
				//	.then(user => {

			// 	return ({
			// 		user,
			// 		// isLiked: helpersreq.getUser(req).LikedUsers.map(d => d.id)
			// 		// 	.includes(user.id)
			// 	})
			// })
			return res.render('tweets', { users, localUser })
		} catch (err) {
			return console.log(err)
		}

	},
	getTweetReplies: (req, res) => {
		return Tweet.findByPk(req.params.id, {
			include: [
				{ model: Reply, include: Tweet },
				{ model: User, as:'LikedUsers'}
			]
		})
			.then(tweet => {
				res.render('reply',
					{
						tweet: tweet
					})
			})
	},
	postTweet: (req, res) => {
		if (!req.body.text) {
			return res.redirect('/tweets')

		}
		if (!req.body.text.length > 140) {
			return res.redirect('/tweets')

		} else {
			Tweet.create({
				UserId: helpersreq.getUser(req).id,
				description: req.body.text,
			})
				.then((tweet) => {
					req.flash('success_msg', '推文成功')
					return res.redirect('/tweets')

				})
		}

	},
	postReplies: (req, res) => {
		if (!req.body.text) {
			return res.redirect('/tweets')

		}
		if (!req.body.text.length > 140) {
			return res.redirect('back')

		} else {
			Reply.create({
				UserId: helpers.getUser(req).id,
				TweetId: req.params.id,
				comment: req.body.text,
			})
				.then((tweet) => {
					req.flash('success_msg', '推文成功')
					return res.redirect('/tweets')

				})
		}

	},
}



module.exports = tweetsController
