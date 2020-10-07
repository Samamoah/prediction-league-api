const JWT = require('jsonwebtoken');
const db = require('../models/index');

const request = require('request');
const User = db['User'];

const callback =
  process.env.NODE_ENV === 'production'
    ? 'https%3A%2F%2Fpredictionleague%2Eonline'
    : 'http%3A%2F%2Flocalhost%3A5000';

signToken = (user) => {
  return JWT.sign(
    {
      iss: 'PredictionLeague',
      sub: user.id,
      //iat: new Date().getTime(), // current time
      //exp: new Date().setDate(new Date().getDate() + 1), // current time + 1 day ahead
    },
    process.env.JWT_SECRET
  );
};

module.exports = {
  getUsers(req, res) {
    User.findAll({ include: { all: true } })
      .then((users) => {
        res.json({
          confirmation: 'success',
          data: users,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  updateUser(req, res) {
    User.findByPk(req.params.id)
      .then((user) => {
        if(user){
          user.update({
            name: req.body.name
          }).then(() => {

        res.json({
          confirmation: 'success',
          data: 'done',
        });
          })
        }
        res.json({
          confirmation: 'success',
          data: 'user not found',
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  getUser(req, res) {
    User.findByPk(req.params.id, {
      include: ['groups', 'created', 'predictions'],
    })
      .then((users) => {
        res.json({
          confirmation: 'success',
          data: users,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  addUser(req, res) {
    var { email, picture } = req.body;

    User.findOrCreate({
      where: { name: req.body.name },
      defaults: {
        email,
        picture,
      },
    })
      .spread((user, created) => {
        console.log(created);
        res.redirect('/user');
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  googleOAuth: async (req, res, next) => {
    // Generate token
    try {
      // console.log(req.user[0]);
      const token = await signToken(req.user[0]);
      return res.status(200).json({ user: req.user[0], token });
    } catch (err) {
      return res.json({
        status: 'fail',
        message: err,
      });
    }
  },
  twitterOAuth: async (req, res, next) => {
    try {
      const token = await signToken(req.user[0]);
      return res.status(200).json({ user: req.user[0], token });
    } catch (err) {
      return res.json({
        status: 'fail',
        message: err,
      });
    }
  },
  googleCallback: async (req, res, next) => {
    // Generate token

    res.status(200);
  },
  logOut: (req, res, next) => {
    // Generate token

    req.logout();
    res.status(200).json({ done: 'done' });
  },

  twitterReq(req, res, next) {
    request.post(
      {
        url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
        oauth: {
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
          token: req.query.oauth_token,
        },
        form: { oauth_verifier: req.query.oauth_verifier },
      },
      function (err, r, body) {
        if (err) {
          return res.send(500, { message: err.message });
        }

        const bodyString =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        const parsedBody = JSON.parse(bodyString);

        req.body['oauth_token'] = parsedBody.oauth_token;
        req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
        req.body['user_id'] = parsedBody.user_id;

        next();
      }
    );
  },
  twitterReverse(req, res) {
    request.post(
      {
        url: 'https://api.twitter.com/oauth/request_token',
        oauth: {
          oauth_callback: callback,
          consumer_key: process.env.TWITTER_CONSUMER_KEY,
          consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        },
      },
      function (err, r, body) {
        if (err) {
          return res.send(500, { message: e.message });
        }

        var jsonStr =
          '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
        res.send(JSON.parse(jsonStr));
      }
    );
  },
};
