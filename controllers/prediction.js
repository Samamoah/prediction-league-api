const db = require('../models/index');
const { default: Axios } = require('axios');
const Prediction = db['Prediction'];
const Game = db['Game'];

module.exports = {
  getPrediction(req, res) {
    Prediction.findByPk(req.params.id, { include: ['games', 'creator'] })
      .then((prediction) => {
        res.json({
          confirmation: 'success',
          data: prediction,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err.message,
        });
      });
  },
  getPredictions(req, res) {
    Prediction.findAll({ include: ['games', 'creator'] })
      .then((predictions) => {
        res.json({
          confirmation: 'success',
          data: predictions,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  findPrediction(req, res) {
    Prediction.findAll({
      where: { UserId: req.params.user, matchday: 1 },
    })
      .then((predictions) => {
        res.json({
          confirmation: 'success',
          data: predictions,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },

  createPrediction(req, res) {
    let { matchday, competition, games, UserId } = req.body;

    console.log(games);

    Prediction.create(
      {
        matchday,
        competition,
        UserId,
        games,
      },
      {
        include: ['games'],
      }
    )
      .then((newprediction) => {
        res.json({
          confirmation: 'success',
          data: newprediction,
        });
      })
      .catch((err) => {
        res.status(200).json({
          confirmation: 'fail',
          message: err.message,
        });
      });
  },
};
