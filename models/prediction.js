'use strict';
//const Game = require('./game');
module.exports = (sequelize, DataTypes) => {
  const Prediction = sequelize.define(
    'Prediction',
    {
      matchday: DataTypes.INTEGER,
      competition: DataTypes.STRING,
      UserId: DataTypes.STRING,
    },
    {}
  );
  Prediction.associate = function (models) {
    var { Game, User } = models;
    // associations can be defined here
    Prediction.hasMany(Game, {
      as: 'games',
    });
    Prediction.belongsTo(User, {
      foreignKey: 'UserId',
      as: 'creator',
    });
  };
  return Prediction;
};

//entities.Game.belongsTo(entities.Prediction, {
//   as: 'predictionWeek',
//   foreignKeyConstraint: true,
// });

// entities.Prediction.belongsTo(entities.User, {
//   foreignKey: 'UserId',
//   as: 'creator',
// });
// entities.Prediction.hasMany(entities.Game, {
//   as: 'games',
// });

// entities.User.hasMany(entities.Group, { as: 'created' });
// entities.User.hasMany(entities.Prediction, {
//   foreignKey: 'UserId',
//   as: 'predictions',
//   foreignKeyConstraint: true,
// });
// entities.User.belongsToMany(entities.Group, {
//   through: 'GroupUsers',
//   as: 'groups',
// });

// entities.Group.belongsTo(entities.User, {
//   foreignKey: 'UserId',
//   as: 'creator',
// });
// entities.Group.belongsToMany(entities.User, {
//   through: 'GroupUsers',
//   as: 'members',
// });
