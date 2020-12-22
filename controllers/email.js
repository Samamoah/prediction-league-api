const db = require('../models/index');
const { client } = require('../config/email');

const User = db['User'];

// send the message and get a callback with an error or details of the message that was sent

module.exports = {
  sendMatchdayMail(req, res) {
    User.findAll()
      .then((users) => {
        users.forEach((user) => {
          client.send(
            {
              text: `
              Hello ${user.name},

              Don't forget to predict Gameweek 22 games. Premier League games
              
              Merry Christmas
              `,
              from: 'no-reply@predictionleague.com',
              to: user.email,
              //cc: 'else <else@your-email.com>',
              subject: 'Prediction League',
            },
            (err, message) => {
              console.log(err || 'done');
            }
          );
        });
        res.json({
          confirmation: 'success',
          data: 'done',
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  sendPointsMail(req, res) {
    User.findAll()
      .then((users) => {
        users.forEach((user) => {
          client.send(
            {
              text: `
              Hello ${user.name},
              This gameweek points have been awarded              
              Regards
              `,
              from: 'no-reply@predictionleague.com',
              to: user.email,
              //cc: 'else <else@your-email.com>',
              subject: 'Prediction League',
            },
            (err, message) => {
              console.log(err || 'done');
            }
          );
        });
        res.json({
          confirmation: 'success',
          data: 'done',
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
