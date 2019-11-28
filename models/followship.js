'use strict';
module.exports = (sequelize, DataTypes) => {
  const Followship = sequelize.define('Followship', {
    FollowerId: DataTypes.integer,
    FollowingId: DataTypes.integer
  }, {});
  Followship.associate = function(models) {
  };
  return Followship;
};
