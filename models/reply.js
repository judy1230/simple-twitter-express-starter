'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    TweetId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {});
  Reply.associate = function (models) {
    Reply.belongsTo(models.Tweet)
    Reply.belongsTo(models.User)
  };
  return Reply;
};
