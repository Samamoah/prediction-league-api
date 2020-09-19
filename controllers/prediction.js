const db = require('../models/index');
//const { default: Axios } = require('axios');
//const prediction = require('../models/prediction');
const Prediction = db['Prediction'];
const Game = db['Game'];
const User = db['User'];

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
      where: {
        UserId: req.params.user,
        matchday: req.params.matchday,
      },
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
  findUserPredictions(req, res) {
    Prediction.findAll({
      where: { UserId: req.params.user },
      include: ['games'],
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
  awardPredictionUser(req, res) {
    Prediction.findAll({
      //include: [{ model: Game, as: 'games' }],
      include: ['games'],
      where: { UserId: req.params.user },
    })
      .then((predictions) => {
        //   .map((prediction) => prediction.games)
        if (predictions.length > 0) {
          var predgames = [];
          for (var i = 0; i < predictions.length; i++) {
            var games = predictions[i].games;
            for (var v = 0; v < games.length; v++) {
              predgames.push(games[v]);
            }
          }

          if (predgames.length > 0) {
            var points = predgames
              .map((game) => game.points)
              .reduce((value, current) => value + current);
            User.update(
              {
                points: points,
              },
              {
                where: { id: req.params.user },
              }
            ).then(() => {
              res.json({
                confirmation: 'success',
                message: 'awarded',
              });
            });
          } else {
            res.json({
              confirmation: 'success',
              message: 'doesnt have games',
            });
          }
        } else {
          res.json({
            confirmation: 'success',
            message: 'dont have predictions',
          });
        }
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  awardPredictionUsers(req, res) {
    User.findAll()
      .then((users) => {
        users.map((user) => {
          Prediction.findAll({
            //include: [{ model: Game, as: 'games' }],
            include: ['games'],
            where: { UserId: user.id },
          })
            .then((predictions) => {
              //   .map((prediction) => prediction.games)
              if (predictions.length > 0) {
                var predgames = [];
                for (var i = 0; i < predictions.length; i++) {
                  var games = predictions[i].games;
                  for (var v = 0; v < games.length; v++) {
                    predgames.push(games[v]);
                  }
                }

                if (predgames.length > 0) {
                  var points = predgames
                    .map((game) => game.points)
                    .reduce((value, current) => value + current);
                  User.update(
                    {
                      points: points,
                    },
                    {
                      where: { id: req.params.user },
                    }
                  ).then(() => {
                    console.log('games awarded');
                  });
                } else {
                  console.log('dont have games awarded');
                }
              } else {
                rconsole.log('dont have prediction games awarded');
              }
            })
            .catch(() => {
              console.log('fail');
            });
        });
      })
      .then(() => {
        res.json({
          confirmation: 'success',
          message: 'awarded',
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  awardPredictionGraphUser(req, res) {
    Prediction.findAll({
      //include: [{ model: Game, as: 'games' }],
      include: ['games'],
      where: { UserId: req.params.user },
      //limit: 5,
    })
      .then((predictions) => {
        //console.log('here');
        var predgames = [];
        for (var i = 0; i < predictions.length; i++) {
          // console.log('here');
          if (predictions[i].games.length > 0) {
            var points = predictions[i].games
              .map((game) => game.points)
              .reduce((value, current) => value + current);
            console.log(predictions[i].id);
            console.log(predictions[i].matchday);
            console.log(points);
            var pred = {
              id: predictions[i].id,
              matchday: predictions[i].matchday,
              points: points,
            };
            predgames.push({
              id: predictions[i].id,
              matchday: predictions[i].matchday,
              points: points,
            });
          }
        }

        res.json({
          confirmation: 'success',
          data: predgames,
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
