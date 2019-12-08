const express = require('express');
const router = express.Router();

const adminController = require('../controller/adminController')
const userController = require('../controllers/userController.js')
const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

//編輯使用者
router.get('./user/:id/edit', authenticated, userController.editUser)
router.put('/user/:id/edit', authenticated, upload.sigle('avatar'), userController.putUSer)
//追蹤路由
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)

router.post('/following/:userId', userController.addFollowing)
router.delete('/following/:userId', userController.removeFollowing)

module.exports = router