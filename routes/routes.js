const express = require('express');
const router = express.Router();

const tweetsController = require('../controllers/tweetsController.js')
//const adminController = require('../controllers/adminController.js')
//const apiAdminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
//const categoryController = require('../controllers/categoryController.js')
//const commentController = require('../controllers/commentController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')


//module.exports = (router, passport) => {
const authenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
	if (req.isAuthenticated()) {
		if (req.user.isAdmin) { return next() }
		return res.redirect('/')
	}
	res.redirect('/signin')
}
//get in login page
router.get('/', (req, res) => res.redirect('/tweets'))

// //user controller
router.get('/tweets', authenticated,tweetsController.getTweets)
router.post('/tweets', authenticated,tweetsController.postTweet)
router.get('/tweets/:id/replies', authenticated,tweetsController.getTweetReplies)
// router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// router.get('/restaurants/top', authenticated, restController.getTopRestaurants)

// router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// router.get('/restaurants/:id/dashboard', authenticated, restController.getResDashboard)
router.post('/tweets/:id/replies', authenticated, tweetsController.postReplies)
// router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
// router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
// router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('tweets/:tweetId/like', authenticated, userController.addLike)
router.delete('tweets/:tweetId/like', authenticated, userController.removeLike)


// //user profile
// router.get('/users/top', authenticated, userController.getTopUsers)
// //router.get('/users/top/:id', authenticated, userController.getUserProfile)
// router.put('/users/:id', authenticated, userController.putUser)
 router.get('/users/:id', authenticated, userController.getUser)
// router.get('/users/:id/edit', authenticated, userController.editUser)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)


// //get in admin
// router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
// router.get('/admin/restaurants', adminController.getRestaurants)

// //admin config
// //categories
// router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
// router.post('/admin/categories', authenticatedAdmin, categoryController.postCategories)
// router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
// router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
// router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

// //admin manage users
// router.get('/admin/users', authenticatedAdmin, adminController.editUsers)
// router.get('/admin/setUser/:id', authenticatedAdmin, adminController.putUsers)

// //restaurants
// router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
// router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
// router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
// router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
// router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
// router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
// router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
// //users sign up
// router.get('/signup', userController.signUpPage)
// router.post('/signup', userController.signUp)
// //users sing in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
	failureRedirect: '/signin',
	failureFlash: true
}), userController.signIn)
//users logout
router.get('/logout', userController.logout)
//}
module.exports = router
