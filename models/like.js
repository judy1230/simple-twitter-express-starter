'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    UserId: DataTypes.integer,
    TweetId: DataTypes.integer
  }, {});
  Like.associate = function(models) {
  };
  return Like;
};
