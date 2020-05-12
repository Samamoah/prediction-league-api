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
    // associations can be defined here
    User.hasMany(models.Group, { as: 'created' });

    User.belongsToMany(models.Group, { through: 'GroupUsers', as: 'groups' });
  };
  return User;
};
