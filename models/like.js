'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    followerId: DataTypes.INTEGER,
    followingId: DataTypes.INTEGER
  }, {}
  );
  Like.associate = function (models) {
    Like.belongsTo(models.Tweet)
    Like.belongsTo(models.User)
  };
  return Like;
};