'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define(
    'Game',
    {
      date: DataTypes.STRING,
      gameId: DataTypes.INTEGER,
      PredictionId: DataTypes.INTEGER,
      points: DataTypes.INTEGER,
      winner: DataTypes.STRING,
      homeTeam: DataTypes.INTEGER,
      awayTeam: DataTypes.INTEGER,
    },
    {}
  );
  Game.associate = function (models) {
    //associations can be defined here
    var { Prediction } = models;
    Game.belongsTo(Prediction, {
      as: 'predictionWeek',
      foreignKeyConstraint: true,
    });
  };
  return Game;
};
