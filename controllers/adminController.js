const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '158d5ec5eff6842'
const fs = require('fs')
const helpersreq = require('../_helpers')


const adminController = {
	getTweets: (req, res) => {

		return Tweet.findAll({
			order: [
				['id', 'ASC'],
			],
			include: [
				Reply,
				User
			]
		}).then(tweets => {
			return res.render('admin/dashboard',{
				tweets: tweets,
				user: helpersreq.getUser(req),
				isAuthenticated: helpersreq.ensureAuthenticated(req)
			})
		})
	},
	deleteTweet: (req, res) => {
		return Tweet.findByPk(req.params.id)
			.then((tweet) => {
				console.log('tweet', tweet)
				tweet.destroy()
					.then((tweet) => {
						return res.redirect('/admin/tweets')
					})
			})
	},

	getUsers: (req, res) => {
		return User.findAll({
			order: [
				['id', 'ASC'],
			],
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
			.then(users => {
				return res.render('admin/users', {
				users: users,
				setRole: false
			})

		})
	},
	
}
module.exports = adminController
