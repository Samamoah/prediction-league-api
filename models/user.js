'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      picture: DataTypes.STRING,
    },
    {}
  );
  User.associate = function (models) {
    var { Group, Prediction } = models;
    User.hasMany(Group, { as: 'created' });
    User.hasMany(Prediction, {
      as: 'predictions',
    });
    User.belongsToMany(Group, {
      through: 'GroupUsers',
      as: 'groups',
      foreignKey: 'UserId',
    });
  };
  return User;
};
