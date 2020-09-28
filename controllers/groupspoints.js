const db = require('../models/index');
const User = db['User'];
const Group = db['Group'];
const Prediction = db['Prediction'];
const Game = db['Game'];
module.exports = {
  async getUsersGroups(req, res) {
    try {
      var user = await User.findOne({ where: { id: req.params.id } });
      var groups = await Group.findAll({
        include: {
          model: User,
          as: 'members',
          include: {
            model: Prediction,
            as: 'predictions',
            include: { model: Game, as: 'games' },
          },
        },
      });
      var filteredgroups = [];
      if (groups.length > 0) {
        for (var i = 0; i < groups.length; i++) {
          var predgroup = groups[i];
          if (predgroup.members.length > 0) {
            for (var v = 0; v < predgroup.members.length; v++) {
              if (predgroup.members[v].predictions.length > 0) {
                for (
                  var b = 0;
                  b < predgroup.members[v].predictions.length;
                  b++
                ) {
                  //console.log('here');
                  if (
                    new Date(predgroup.members[v].predictions[b].createdAt) <
                    new Date(predgroup.createdAt)
                  ) {
                    /// console.log(predgroup.members[v].predictions[b].id);
                    predgroup.members[v].predictions.splice(
                      predgroup.members[v].predictions.indexOf(
                        predgroup.members[v].predictions[b]
                      )
                    );
                  }
                }
              }
              var predgames = [];
              for (
                var c = 0;
                c < predgroup.members[v].predictions.length;
                c++
              ) {
                var games = predgroup.members[v].predictions[c].games;
                for (var h = 0; h < games.length; h++) {
                  predgames.push(games[h]);
                }
              }

              if (predgames.length > 0) {
                var points = predgames
                  .map((game) => game.points)
                  .reduce((value, current) => value + current);
                predgroup.members[v].points = points;
              } else {
                predgroup.members[v].points = 0;
              }
            }
          }
          filteredgroups.push(predgroup);
        }
      }

      var newgroups = [];
      for (var i = 0; i < filteredgroups.length; i++) {
        for (var h = 0; h < filteredgroups[i].members.length; h++) {
          if (filteredgroups[i].members[h].id === user.id) {
            newgroups.push(filteredgroups[i]);
          }
        }
      }

      res.json({
        confirmation: 'success',
        data: newgroups,
      });
    } catch (err) {
      res.json({
        confirmation: 'fail',
        message: err,
      });
    }
  },

  getUGroup(req, res) {
    Group.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'members',
          include: {
            model: Prediction,
            as: 'predictions',
            include: { model: Game, as: 'games' },
          },
        },
        'creator',
      ],
    })
      .then((group) => {
        var filteredgroup = {};
        var predgroup = group;
        if (predgroup.members.length > 0) {
          for (var v = 0; v < predgroup.members.length; v++) {
            if (predgroup.members[v].predictions.length > 0) {
              for (
                var b = 0;
                b < predgroup.members[v].predictions.length;
                b++
              ) {
                //console.log('here');
                if (
                  new Date(predgroup.members[v].predictions[b].createdAt) <
                  new Date(predgroup.createdAt)
                ) {
                  /// console.log(predgroup.members[v].predictions[b].id);
                  predgroup.members[v].predictions.splice(
                    predgroup.members[v].predictions.indexOf(
                      predgroup.members[v].predictions[b]
                    )
                  );
                }
              }
            }
            var predgames = [];
            for (var c = 0; c < predgroup.members[v].predictions.length; c++) {
              var games = predgroup.members[v].predictions[c].games;
              for (var h = 0; h < games.length; h++) {
                predgames.push(games[h]);
              }
            }

            if (predgames.length > 0) {
              var points = predgames
                .map((game) => game.points)
                .reduce((value, current) => value + current);
              predgroup.members[v].points = points;
            } else {
              predgroup.members[v].points = 0;
            }
          }
        }
        filteredgroup = predgroup;

        res.json({
          confirmation: 'success',
          data: filteredgroup,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
};
