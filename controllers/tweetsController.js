const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const pageLimit = 10

const tweetsController = {
	getTweets:  async(req, res) => {
		 console.log('req.user', req.user.id)
		// User.findByPk(req.params.id, {
		// 	include: [
		// 		{
		// 			model: Tweet, include: [
		// 				{ model: User, as: 'LikedUsers' },
		// 				Reply
		// 			]
		// 		},
		// 		{ model: Reply, include: Tweet },
		// 		{ model: Tweet, as: 'LikedTweets' },
		// 		{ model: User, as: 'Followers' },
		// 		{ model: User, as: 'Followings' }
		// 	]
		// }).then(user => {
		// 	User.findAll({
		// 		include: [
		// 			{ model: User, as: 'Followers' }
		// 		]
		// 	}).then((user,users) => {
		// 		users.map(user => ({
		// 			...user.dataValues,
		// 			//計算追蹤者人數
		// 			FollowerCount: user.Followers.length,
		// 			//判斷目前登入使用者是否已追中該User物件
		// 			//isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
		// 		}))
		// 		//依追蹤者人數排列清單
		// 		users.sort((a, b) => b.FollowerCount - a.FollowerCount)
		// 	}).then((user, users) => {
		// 		return res.render('tweets',
		// 			{
		// 				user: user,
		// 				TopFollowers: users,
		// 			})
		// 	})

		// })





		try {
			TopFollowers = await User.findAll({
				include: [
					{ model: User, as: 'Followers' }
				]
			}).then(users => {
				users.map(user => ({
					...user.dataValues,
					//計算追蹤者人數
					FollowerCount: user.Followers.length,
					//判斷目前登入使用者是否已追中該User物件
					//isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
				}))
				//依追蹤者人數排列清單
				return users.sort((a, b) => b.FollowerCount - a.FollowerCount)
			})
			user = await User.findByPk(req.params.id, {
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
			})
			console.log('user',user)
			res.render('tweets',
				{
					user: user,
					TopFollowers: TopFollowers,
				})

		} catch (err) {
			return console.log(err)
		}

	},
	getTweetReplies: (req, res) => {
		return Tweet.findByPk(req.params.id, {
			include: [
				//Reply
				 { model: Reply, include: Tweet },
				// { model: Tweet, as: 'LikedTweets' },
				// { model: User, as: 'Followers' },
				// { model: User, as: 'Followings' }
			]
		})
			.then(tweet => {
				console.log('user.Tweet', tweet)
				res.render('reply',
					{
						tweet: tweet
					})
			})
		// 	include: [
		// 		//Tweet,
		// 		{ model: Tweet, where: {Id: req.paras.id} },
		// 		{ model: Reply, include: Tweet },
		// 		{ model: Tweet, as: 'LikedTweets' },
		// 		{ model: User, as: 'Followers' },
		// 		{ model: User, as: 'Followings' }
		// 	]
		// })
		// 	.then(user => {
		// 		//console.log('user.Tweets', user.LikedTweets.length)
		// 		res.render('reply',
		// 			{
		// 				user: user
		// 			})
		// 	})
		// return User.findByPk(req.params.id, {
		// 	include: [
		// 		//Tweet,
		// 		{ model: Tweet, where: {Id: req.paras.id} },
		// 		{ model: Reply, include: Tweet },
		// 		{ model: Tweet, as: 'LikedTweets' },
		// 		{ model: User, as: 'Followers' },
		// 		{ model: User, as: 'Followings' }
		// 	]
		// })
		// 	.then(user => {
		// 		//console.log('user.Tweets', user.LikedTweets.length)
		// 		res.render('reply',
		// 			{
		// 				user: user
		// 			})
		// 	})
	},
	postTweet: (req, res) => {
		if (!req.body.text) {
			return res.redirect('/tweets')

		}
		if (!req.body.text.length > 140) {
			return res.redirect('/tweets')

		}else {
		  Tweet.create({
				UserId: "1",
				description: req.body.text,
			})
				.then((tweet) => {
					req.flash('success_msg', '推文成功')
					return res.redirect('/tweets')

				})
		}

	},

}



module.exports = tweetsController
