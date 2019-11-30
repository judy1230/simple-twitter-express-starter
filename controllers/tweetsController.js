const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const pageLimit = 10

const tweetsController = {
	getTweets: async (req, res) => {
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
			user = await User.findByPk('1', {
				include: [
					{ model: Tweet, include: [
							{ model: User, as: 'LikedUsers' },
							Reply
					]},
					{ model: Reply, include: Tweet },
					{ model: Tweet, as: 'LikedTweets'},
					{ model: User, as: 'Followers' },
					{ model: User, as: 'Followings' }
				]
			})
			// tweetLikedUsers = await Tweet.findAll({
			// 	where: { UserId: '1'},
			// 	include: [
			// 		{ model: User, as: 'LikedUsers' },
			// 		Reply
			// 	]
			// })
			// tweets= await Tweet.findAll({
			// 	where: { UserId: '1' },
			// 	include: [
			// 		Reply,
			// 		{ model: User, as: 'LikedUsers' },
			// 	]
			// })
			//console.log('tweets', tweets)
			console.log('user.Tweets',user.Tweets)
			res.render('tweets',
				{
					user: user,
					//tweets: tweets,
					TopFollowers: TopFollowers,
					//tweetLikedUsersLength: tweetLikedUsers.length
				})

		} catch (err) {
			return console.log(err)
		}

	},
	getTweet: (req, res) => {
		return User.findByPk('2', {
			include: [
				Tweet,
				{ model: Reply, include: Tweet },
				{ model: Tweet, as: 'LikedTweets' },
				{ model: User, as: 'Followers' },
				{ model: User, as: 'Followings' }
			]
		})
			.then(user => {
				//console.log('user.Tweets', user.LikedTweets.length)
				res.render('tweet',
					{
						user: user
					})
			})
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
