let routes = require('./routes');
//let apis = require('./apis')
const express = require('express');
const app = express.Router();

const tweetsController = require('../controllers/tweetsController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

module.exports = (app, passport) => {


// 	const authenticated = (req, res, next) => {
// 		if (helpersreq.ensureAuthenticated(req)) {
// 			return next()
// 		}
// 		res.redirect('/signin')
// 	}
// 	const authenticatedAdmin = (req, res, next) => {
// 		if (helpersreq.ensureAuthenticated(req)) {
// 			if (helpersreq.getUser(req).role === 'admin') { return next() }
// 			return res.redirect('/')
// 		}
// 		res.redirect('/signin')
// 	}
    app.use('/', routes)
// 	//get in login page
// 	app.get('/', (req, res) => res.redirect('/tweets'))

// 	// //user controller
// 	app.get('/tweets', authenticated, tweetsController.getTweets)
// 	app.post('/tweets', authenticated, tweetsController.postTweet)
// 	app.get('/tweets/:id/replies', authenticated, tweetsController.getTweetReplies)
// 	// app.get('/restaurants/feeds', authenticated, restController.getFeeds)
// 	// app.get('/restaurants/top', authenticated, restController.getTopRestaurants)

// 	// app.get('/restaurants/:id', authenticated, restController.getRestaurant)
// 	// app.get('/restaurants/:id/dashboard', authenticated, restController.getResDashboard)
// 	app.post('/tweets/:id/replies', authenticated, tweetsController.postReplies)
// 	// app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
// 	// app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
// 	// app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// 	app.post('tweets/:tweetId/like', authenticated, userController.addLike)
// 	app.delete('tweets/:tweetId/like', authenticated, userController.removeLike)


// 	// //user profile
// 	// app.get('/users/top', authenticated, userController.getTopUsers)
// 	// //app.get('/users/top/:id', authenticated, userController.getUserProfile)
// 	// app.put('/users/:id', authenticated, userController.putUser)
// 	app.get('/users/:id/tweets', authenticated, userController.getUser)
// 	// app.get('/users/:id/edit', authenticated, userController.editUser)
// 	app.post('/users/:userId/following/', authenticated, userController.addFollowing)
// 	app.delete('/users/:userId/following/', authenticated, userController.removeFollowing)


// 	// //get in admin
// 	app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
// 	app.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
// 	app.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

// 	// //admin manage users
// 	app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
// 	// app.get('/admin/setUser/:id', authenticatedAdmin, adminController.putUsers)

// 	// //restaurants
// 	// app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
// 	// app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
// 	// app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
// 	// app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
// 	// app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
// 	// app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

// 	// //users sign up
// 	app.get('/signup', userController.signUpPage)
// 	app.post('/signup', userController.signUp)
// 	// //users sing in
// 	app.get('/signin', userController.signInPage)
// 	app.post('/signin', passport.authenticate('local', {
// 		failureRedirect: '/signin',
// 		failureFlash: true
// 	}), userController.signIn)
// 	//users logout
// 	app.get('/logout', userController.logout)
// //}
	//app.use('/api', apis)
}
