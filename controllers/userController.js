const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
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
	// getUser: (req, res) => {
	// 	userService.getUser(req, res, (data) => {
	// 		return res.render('profile', data)
	// 	})
	// },
	// editUser: (req, res) => {

	// 	return User.findByPk(req.params.id)
	// 		.then(user => {
	// 			return res.render('editProfile', {
	// 				user: user
	// 			})
	// 		})
	// },
	// putUser: (req, res) => {
	// 	userService.putUser(req, res, (data) => {
	// 		if (data['status'] === 'success') {
	// 			req.flash('success_msg', data['message'])
	// 		}
	// 		return res.redirect(`/users/${req.params.id}`)
	// 	})
	// },
	// addFavorite: (req, res) => {
	// 	userService.addFavorite(req, res, (data) => {
	// 		return res.redirect('back')
	// 	})
	// },
	// removeFavorite: (req, res) => {
	// 	userService.removeFavorite(req, res, (data) => {
	// 		return res.redirect('back')
	// 	})
	// },
	// addLike: (req, res) => {
	// 	userService.addLike(req, res, (data) => {
	// 		return res.redirect('back')
	// 	})
	// },
	// removeLike: (req, res) => {
	// 	userService.removeLike(req, res, (data) => {
	// 		return res.redirect('back')
	// 	})
	// },
	// getTopUsers: (req, res) => {
	// 	userService.getTopUsers(req, res, (data) => {
	// 		return res.render('topUser', data)
	// 	})
	// },
	addFollowing: (req, res) => {
		return Followship.create({
			followerId: req.user.id,
			followingId: req.params.userId
		})
			.then((followship) => {
				return res.redirect('back')
			})
	},

	removeFollowing: (req, res) => {
		return Followship.findOne({
			where: {
				followerId: req.user.id,
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
