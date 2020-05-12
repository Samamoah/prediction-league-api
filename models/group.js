'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      name: DataTypes.STRING,
      code: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {}
  );
  Group.associate = function (models) {
    // associations can be defined here
    Group.belongsTo(models.User, { foreignKey: 'UserId', as: 'creator' });
    Group.belongsToMany(models.User, { through: 'GroupUsers', as: 'members' });
  };
  return Group;
};
