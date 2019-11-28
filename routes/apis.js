const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')
const restController = require('../controllers/api/restController.js')
const commentController = require('../controllers/api/commentController.js')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
	if (req.user) {
		if (req.user.isAdmin) { return next() }
		return res.json({ status: 'error', message: 'permission denied' })
	} else {
		return res.json({ status: 'error', message: 'permission denied' })
	}
}
// api/restaurants CRUD
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants/:id/dashboard', restController.getResDashboard)
// api/categories CRUD
router.get('/admin/categories', categoryController.getCategories)
router.post('/admin/categories', categoryController.postCategories)
router.get('/admin/categories/:id', categoryController.getCategories)
router.put('/admin/categories/:id', categoryController.putCategory)
router.delete('/admin/categories/:id', categoryController.deleteCategory)
// api/comments api/favorite api/like CRUD
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticated, authenticatedAdmin, commentController.deleteComment)

//已完成
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
// api/user/
router.get('/users/top', authenticated, userController.getTopUsers)
router.put('/users/:id', authenticated, userController.putUser)
router.get('/users/:id', userController.getUser)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
// JWT signin/signup
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

module.exports = router
