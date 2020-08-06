'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      picture: DataTypes.STRING,
      GoogleId: DataTypes.STRING,
    },
    {}
  );
  User.associate = function (models) {
    var { Group, Prediction } = models;
    User.hasMany(Group, { as: 'created' });
    User.hasMany(Prediction, {
      foreignKey: 'UserId',
      as: 'predictions',
      foreignKeyConstraint: true,
    });
    User.belongsToMany(Group, {
      through: 'GroupUsers',
      as: 'groups',
    });
  };
  return User;
};
