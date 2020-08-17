'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    'Game',
    {
      gameId: DataTypes.INTEGER,
      PredictionId: DataTypes.INTEGER,
      points: DataTypes.INTEGER,
      winner: DataTypes.STRING,
      awarded: DataTypes.BOOLEAN,
    },
    {}
  );
  Game.associate = function (models) {
    //associations can be defined here
    var { Prediction } = models;
    Game.belongsTo(Prediction);
  };
  return Game;
};
