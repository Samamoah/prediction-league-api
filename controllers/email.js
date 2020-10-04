const { SMTPClient } = require('emailjs');

const db = require('../models/index');

//const request = require('request');
const User = db['User'];

const client = new SMTPClient({
  user: 'predictionleagueonline@gmail.com',
  password: 'predictionleagueonline',
  host: 'smtp.gmail.com',
  ssl: true,
  post: 465,
});

// send the message and get a callback with an error or details of the message that was sent

module.exports = {
  sendMail(req, res) {
    User.findAll()
      .then((users) => {
        users.forEach((user) => {
          client.send(
            {
              text: `
              Hello ${user.name},

              Don't forget to predict Gameweek 5 games
              
              Regards
              `,
              from: 'samuelamoahtetteh@gmail.com',
              to: user.email,
              //cc: 'else <else@your-email.com>',
              subject: 'Prediction League',
            },
            (err, message) => {
              console.log(err || message);
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
