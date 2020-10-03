'use strict';
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      name: DataTypes.STRING,
      code: DataTypes.INTEGER,
      private: DataTypes.BOOLEAN,
      UserId: DataTypes.INTEGER,
    },
    {}
  );
  Group.associate = function (models) {
    // // associations can be defined here
    var { User } = models;
    Group.belongsToMany(User, {
      through: 'GroupUsers',
      as: 'members',
    });
    Group.belongsTo(User, {
      foreignKey: 'UserId',
      as: 'creator',
    });
  };
  return Group;
};
