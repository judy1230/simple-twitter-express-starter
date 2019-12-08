const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Like = db.Like
const Followship = db.Followship
const Tweet = db.Tweet
const helpers = require('../_helpers')
const sequelize = require('sequelize')


const userController = {
  //編輯資料
  editUser: (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('error_messages', '您無權編輯他人檔案')
      return res.redirect(`/users/${req.params.id}/tweets`)
    } else {
      return User.findByPk(req.params.id).then(user => {
        return res.render('edit')
      })
    }
  },
  putUser: (req, res) => {
    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
      req.flash('error_messages', '您無權編輯他人檔案')
      return res.redirect(`/users/${req.params.id}/tweets`)
    }
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: file ? img.data.link : user.avatar
            })
            .then(user => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect(`/users/${req.params.id}/tweets`)
            })
        })
      })
    } else
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar
          })
          .then(user => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect(`/users/${req.params.id}/tweets`)
          })
      })
  },
  //追蹤功能
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
  },

  getFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      inculde: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        Tweet
      ]
    }).then(user => {
      const totalTweets = user.Tweets.length
      const totalFollowers = user.Followers.length
      const totalFollowings = user.Followings.length
      const totalLiked = user.LikedTweets.length
      const userFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .inculdes(user.id)
      user.Followings = user.Followings.map(r => ({
        ...r.dataValues,
        introduction: r.dataValues.introduction
          ? r.dataValues.introduction.substring(0, 20)
          : r.dataValues.introduction,
        isFollowed: helpers
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(r.dataValues.id)
      })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      res.set('Content-Type', 'text/html')
      return res.render('followings', {
        profile: user,
        userFollowed,
        totalLiked,
        totalFollowers,
        totalFollowings,
        totalTweets
      })
    })
  },
  getFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets' },
        { model: User, as: 'Followings' },
        Tweet
      ]
    }).then(user => {
      const totalTweets = user.Tweets.length
      const totalLiked = user.LikedTweets.length
      const totalFollowers = user.Followers.length
      const totalFollowings = user.Followings.length
      const userFollowed = helpers
        .getUser(req)
        .Followings.map(d => d.id)
        .includes(user.id)
      user.Followers = user.Followers.map(r => ({
        ...r.dataValues,
        introduction: r.dataValues.introduction
          ? r.dataValues.introduction.substring(0, 50)
          : r.dataValues.introduction,
        isFollowed: helpers
          .getUser(req)
          .Followings.map(r => r.id)
          .includes(r.dataValues.id)
      })).sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return res.render('followers', {
        profile: user,
        userFollowed,
        totalLiked,
        totalFollowers,
        totalFollowings,
        totalTweets
      })
    })
  }
}
module.exports = userController