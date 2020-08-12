const db = require('../models/index');
const Game = db['Game'];
const Prediction = db['Prediction'];
const competition = require(__dirname + '/response1.json');

module.exports = {
  getCompetition(req, res) {
    const unfinishedgames = competition.matches
      .map((game) => {
        return {
          id: game.id,
          homeTeam: game.homeTeam.name,
          awayTeam: game.awayTeam.name,
          status: game.status,
        };
      })
      .filter((game) => game.status !== 'FINISHED');

    //console.log('here', req);
    res.json({
      confirmation: 'success',
      matchday: '1',
      competition: competition.competition.name,
      data: unfinishedgames,
    });
  },
  getGame(req, res) {
    Game.findByPk(req.params.id, { include: ['predictionweek'] })
      .then((game) => {
        res.json({
          confirmation: 'success',
          data: game,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  getGames(req, res) {
    Game.findAll({
      include: [{ model: Prediction }],
    })
      .then((game) => {
        res.json({
          confirmation: 'success',
          data: game,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  createGame(req, res) {
    let {
      date,
      gameId,
      PredictionId,
      points,
      winner,
      homeTeam,
      awayTeam,
    } = req.body;

    Group.create({
      date,
      gameId,
      PredictionId,
      points,
      winner,
      homeTeam,
      awayTeam,
    })
      .then(async (newgame) => {
        res.json({
          confirmation: 'success',
          data: newgame,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  updateGroup(req, res) {
    Group.update(
      { points: req.body.points },
      {
        where: { id: req.params.id },
      }
    )
      .then((group) => res.redirect('/group'))
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
};
