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
					Tweet,
					{ model: Reply, include: Tweet },
					{ model: Tweet, as: 'LikedTweets' },
					{ model: User, as: 'Followers' },
					{ model: User, as: 'Followings' }
				]
			})
			//const isLiked = tweet.LikedUsers.map(d => d.id).includes(req.user.id)
			console.log('user.Replies', user.Replies.length)
			console.log('user.LikedTweet', user.LikedTweets.length)
			res.render('tweets',
				{
					TopFollowers: TopFollowers,
					user: user
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
				{ model: Tweet, as: 'LikedTweet' },
				{ model: User, as: 'Followers' },
				{ model: User, as: 'Followings' }
			]
		})
			.then(user => {
				console.log('user.Tweets', user.LikedTweet.length)
				res.render('tweet',
					{
						user: user
					})
			})
	},
	postTweet: (req, res) => {
		if (!req.body.text) {
			callback({ status: 'error', message: "請輸入文字" })

		}
		if (!req.body.text.length > 140) {
			callback({ status: 'error', message: "請限制內容在140字以內" })

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
