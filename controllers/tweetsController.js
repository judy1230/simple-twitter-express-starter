const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const pageLimit = 10
const Followship = db.Followship

const tweetsController = {
	getTweets: (req, res) => {
		return User.findAll({
			include: [
				{ model: User, as: 'Followers' }
			]
		}).then(users => {
			users = users.map(user => ({
				...user.dataValues,
				FollowerCount: user.Followers.length,
				isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
			}))
			users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
			return res.render('tweets', { users: users })
		})

	},
	getTweetReplies: (req, res) => {
		return Tweet.findByPk(req.params.id, {
			include: [
				//Reply
				{ model: Reply, include: Tweet },
				{ model: User, as:'LikedUsers'}
			 // { model: Tweet, as: 'LikedTweets' },
				// { model: User, as: 'Followers' },
				// { model: User, as: 'Followings' }
			]
		})
			.then(tweet => {
				//console.log('user.Tweet', tweet)
				res.render('reply',
					{
						//user: req.user,
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
				UserId: req.user.id,
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
				UserId: req.user.id,
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
