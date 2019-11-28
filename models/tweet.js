'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    description: DataTypes.text,
    UserId: DataTypes.integer
  }, {});
  Tweet.associate = function (models) {

  };
  return Tweet;
};
