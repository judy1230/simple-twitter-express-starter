const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const pageLimit = 10
const Followship = db.Followship
const helpersreq = require('../_helpers.js')


const tweetsController = {
	getTweets: async (req, res) => {
		let offset = 0
		let whereQuery = {}

		try {
			users = await User.findAll({
				include: [
					{ model: User, as: 'Followers' },
					{ model: User, as: 'Followings' },
				]
			}).then(users => {
			  return users.map(user => ({
					...user.dataValues,
					FollowerCount: user.Followers.length,
					isFollowed: helpersreq.getUser(req).Followings.map(d => d.id).includes(user.id)
				}))
			})
			tweets = await Tweet.findAndCountAll({
				order: [
					['updatedAt', 'DESC']
				],
				include: [
					User,
					{ model: User, as: 'LikedUsers' },
					Reply
				],
				where: whereQuery, offset: offset, limit: pageLimit
			})
				.then(result => {
					let page = Number(req.query.page) || 1
					let pages = Math.ceil(result.count / pageLimit)
					let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
					let prev = page - 1 < 1 ? 1 : page - 1
					let next = page + 1 > pages ? pages : page + 1
					//clean up restaurant data
					const data = result.rows.map(r => ({
						...r.dataValues,
						description: r.dataValues.description.substring(0, 50),
						isLiked: helpersreq.getUser(req).LikedTweets ? helpersreq.getUser(req).LikedTweets.map(d => d.id).includes(r.id) : false
					}))
					return { data, page, pages, totalPage, prev, next}
				})
			//console.log('tweet.data', tweets.data)
			return res.render('tweets', {
				users,
				isFollowed: users.isFollowed,
				localUser: helpersreq.getUser(req),
				tweets: tweets.data,
				page: tweets.page,
				totalPage: tweets.totalPage,
				prev: tweets.prev,
				next: tweets.next,
			})
		} catch (err) {
			return console.log(err)
		}

	},
	getTweetReplies: (req, res) => {
		return Tweet.findByPk(req.params.tweet_id, {
			order: [
				[Reply, 'createdAt', 'DESC']
			],
			include: [
				{
					model: User,
					include: [
						Tweet,
						{ model: Tweet, as: 'LikedTweets' },
						{ model: User, as: 'Followers' },
						{ model: User, as: 'Followings' }
					],
				},
				//replies & likedusers in tweet
				{ model: Reply, include: Tweet },
				{ model: User, as: 'LikedUsers' }
			]
		}).then(tweet => {
			const isFollowed = helpersreq.getUser(req).Followings ? helpersreq.getUser(req).Followings.map(d => d.id).includes(tweet.User.id) : false
			res.render('reply',
				{
					tweet: tweet,
					user: tweet.User,
					isFollowed
				})
		})

	},
	postTweet: (req, res) => {
		if (!req.body.text || req.body.test.length === 0) {
			return res.redirect('/tweets')

		}
		if (req.body.text.length > 140) {
			return res.redirect('/tweets')

		} else {
			Tweet.create({
				UserId: helpersreq.getUser(req).id,
				description: req.body.text,
			})
				.then((tweet) => {
					console.log('tweet', tweet)
					tweet.save()
					tweeti = Tweet.findOne({ where: { userId: 1 } })
					console.log('tweeti', tweeti)
					req.flash('success_msg', '推文成功')
					return res.redirect('/tweets')

				})
		}

	},

	postReplies:  (req, res) => {
		if (!req.body.text || req.body.test.length === 0) {
				return res.redirect('back')
			}
			if (req.body.text.length > 140) {
				return res.redirect('back')
			}
			const reply = Reply.create({
					UserId: helpersreq.getUser(req).id,
					TweetId: req.params.tweet_id,
					comment: req.body.text,
				})
		  //reply.save();
			req.flash('success_msg', '回覆成功')
		return res.redirect(`/tweets/${req.params.tweet_id}/replies`)


	},
}



module.exports = tweetsController
