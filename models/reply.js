'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    TweetId: DataTypes.integer,
    UserId: DataTypes.integer,
    comment: DataTypes.string
  }, {});
  Reply.associate = function(models) {
  };
  return Reply;
};
