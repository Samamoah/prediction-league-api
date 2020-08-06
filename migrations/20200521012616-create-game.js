'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.STRING,
      },
      gameId: {
        type: Sequelize.INTEGER,
      },
      PredictionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Predictions',
          key: 'id',
        },
      },
      winner: {
        type: Sequelize.STRING,
      },
      homeTeam: {
        type: Sequelize.INTEGER,
      },
      awayTeam: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Games');
  },
};
