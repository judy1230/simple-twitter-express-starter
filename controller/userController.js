const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Like = db.Like
const Followship = db.Followship
const Tweet = db.Tweet
const helpers = require('../_helpers')
const sequelize = require('sequelize')


const userController = {

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