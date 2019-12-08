const express = require('express');
const router = express.Router();

const tweetsController = require('../controllers/tweetsController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')
const helpersreq = require('../_helpers')

const authenticated = (req, res, next) => {
	console.log(req.user)
	if (helpersreq.ensureAuthenticated(req)) {
		return next()
	}
	res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
	if (helpersreq.ensureAuthenticated(req)) {
		if (helpersreq.getUser(req).role ==='admin') { return next() }
		return res.redirect('/')
	}
	res.redirect('/signin')
}
//get in login page
router.get('/', (req, res) => res.redirect('/tweets'))

// //user controller
router.get('/tweets', authenticated,tweetsController.getTweets)
router.post('/tweets', authenticated, tweetsController.postTweet)
router.get('/users/:id/tweets', authenticated, userController.getUser)
router.get('/tweets/:tweet_id/replies', authenticated,tweetsController.getTweetReplies)
router.post('/tweets/:tweet_id/replies', authenticated, tweetsController.postReplies)
router.post('/tweets/:id/like', authenticated, userController.addLike)
router.post('/tweets/:id/unlike', authenticated, userController.removeLike)

router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:id', authenticated, userController.removeFollowing)


// //get in admin
 router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
router.get('/admin/tweets', authenticatedAdmin,adminController.getTweets)
 router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)

// //admin manage users
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

// //users sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
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
