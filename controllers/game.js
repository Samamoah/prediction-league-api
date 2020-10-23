const db = require('../models/index');
const axios = require('axios');
const Game = db['Game'];
const Prediction = db['Prediction'];
const competition = require(__dirname + '/response1.json');

module.exports = {
  // getCompetition(req, res) {
  //   console.log(competition);
  //   const unfinishedgames = competition.matches
  //     .map((game) => {
  //       return {
  //         id: game.id,
  //         homeTeam: game.homeTeam.name,
  //         awayTeam: game.awayTeam.name,
  //         status: game.status,
  //         matchday: game.matchday,
  //         currentMatchday: game.season.currentMatchday,
  //       };
  //     })
  //     .filter((game) => game.matchday === game.currentMatchday)
  //     .filter((game) => game.status !== 'FINISHED')
  //     .filter((game) => game.status !== 'IN_PLAY')
  //     .filter((game) => game.status !== 'POSTPONED');

  //   console.log('here', req);
  //   res.json({
  //     confirmation: 'success',
  //     matchday: 2,
  //     competition: competition.competition.name,
  //     data: unfinishedgames,
  //   });
  // },
  async getOnlineGames(req, res) {
    try {
      const competition = await axios.get(
        //`http://api.football-data.org/v2/matches/`,
        `http://api.football-data.org/v2/competitions/2021/matches/`,
        {
          headers: {
            'X-Auth-Token': 'fe71fd8d5918452982b3997c2e0dd782',
          },
        }
      );

      const ucl = await axios.get(
        //`http://api.football-data.org/v2/matches/`,
        `http://api.football-data.org/v2/competitions/2001/matches/`,
        {
          headers: {
            'X-Auth-Token': 'fe71fd8d5918452982b3997c2e0dd782',
          },
        }
      );

      const all = [...competition.data.matches, ...ucl.data.matches]

      const searchgames = all.map((game) => {
        return {
          id: game.id,
          home: game.homeTeam.name,
          away: game.awayTeam.name,
          winner: game.score.winner,
        };
      });
      res.json({ data: searchgames });
    } catch (err) {
      res.json({
        confirmation: 'fail',
        name: err.name,
        message: err.message,
        data: [],
      });
    }
  },
  async getCompetition(req, res) {
    try {
      const competition = await axios.get(
        `http://api.football-data.org/v2/competitions/2021/matches/`,
        {
          headers: {
            'X-Auth-Token': 'fe71fd8d5918452982b3997c2e0dd782',
          },
        }
      );

      // console.log(competition);
      const unfinishedgames = competition.data.matches
        .map((game) => {
          return {
            id: game.id,
            homeTeam: game.homeTeam.name,
            awayTeam: game.awayTeam.name,
            status: game.status,
            matchday: game.matchday,
            currentMatchday: game.season.currentMatchday,
          };
        })
        .filter((game) => game.matchday === 6)
        .filter((game) => game.status !== 'IN_PLAY')
        .filter((game) => game.status !== 'PAUSED')
        .filter((game) => game.status !== 'FINISHED');
      // .filter((game) => game.status !== 'POSTPONED');

      

      //console.log('here', req);
      res.json({
        confirmation: 'success',
        matchday: 8,
        competition: competition.data.competition.name,
        data: unfinishedgames,
      });
    } catch (err) {
      res.json({
        confirmation: 'fail',
        name: err.name,
        message: err.message,
        data: [],
      });
    }
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
  async awardPoints(req, res) {
     const competition = await axios.get(
        //`http://api.football-data.org/v2/matches/`,
        `http://api.football-data.org/v2/competitions/2021/matches/`,
        {
          headers: {
            'X-Auth-Token': 'fe71fd8d5918452982b3997c2e0dd782',
          },
        }
      );

      const ucl = await axios.get(
        //`http://api.football-data.org/v2/matches/`,
        `http://api.football-data.org/v2/competitions/2001/matches/`,
        {
          headers: {
            'X-Auth-Token': 'fe71fd8d5918452982b3997c2e0dd782',
          },
        }
      );


      const all = [...competition.data.matches, ...ucl.data.matches]

    Game.findAll({ raw: true })
      .then((games) => {
        // console.log(games);
        for (let i = 0; i < games.length; i++) {
          const element = games[i];
          var state = element.awarded;

          var id = element.gameId;

          if (!state) {
            const scoregame = all
              .map((game) => {
                return {
                  id: game.id,
                  winner: game.score.winner,
                  status: game.status,
                };
              })
              .filter((game) => game.id === id);

            if (scoregame[0].status === 'FINISHED') {
              if (element.winner === scoregame[0].winner) {
                Game.update(
                  {
                    points: 3,
                    awarded: true,
                  },
                  {
                    where: { id: element.id },
                  }
                )
                  .then(() => console.log('done'))
                  .catch((err) => console.log(err));
              } else {
                Game.update(
                  {
                    points: 0,
                    awarded: true,
                  },
                  {
                    where: { id: element.id },
                  }
                )
                  .then(() => console.log('done'))
                  .catch((err) => console.log(err));
              }
            }
          }
        }
        res.json({
          confirmation: 'success',
          message: 'Awarding points excuted',
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
  getGameOnline(req, res) {
    axios
      .get(`http://api.football-data.org/v2/matches/${req.params.game}`, {
        headers: {
          'X-Auth-Token': 'fe71fd8d5918452982b3997c2e0dd782',
        },
      })
      .then((data) => {
        // console.log(res.data.match);
        res.json({
          confirmation: 'success',
          home: data.data.match.homeTeam.name,
          away: data.data.match.awayTeam.name,
          winner: data.data.match.score.winner,
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
