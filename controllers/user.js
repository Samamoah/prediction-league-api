const JWT = require('jsonwebtoken');
const sequelize = require('sequelize');
const db = require('../models/index');
const { client } = require('../config/email');
const bcrypt = require('bcryptjs');
const Op = sequelize.Op;
const crypto = require('crypto');
const jade = require('jade');

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
  register(req, res) {
    const { username, email, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        try {
          var user = await User.findOrCreate({
            include: { all: true },
            where: { email: email },
            defaults: {
              name: username,
              email: email,
              picture: '',
              password: hash,
            },
          });
          res.json({ data: user });
        } catch (err) {
          res.send(err);
        }
      });
    });
  },
  logIn(req, res) {
    var { email, password } = req.body;
    if (!email || !password) {
      res.json({
        confirmation: 'fail',
        message: 'Enter Email and Password',
      });
    } else {
      User.findOne({ where: { email: email } }).then((user) => {
        if (!user) {
          res.json({
            confirmation: 'fail',
            message: 'Email not found',
          });
        } else {
          bcrypt.compare(password, user.password).then(async (isMatch, err) => {
            if (isMatch) {
              const token = await signToken(user);
              return res.status(200).json({ user: user, token });
            } else {
              res.json({
                confirmation: 'fail',
                message: 'Wrong Password',
              });
            }
          });
        }
      });
    }
  },
  changePassword(req, res) {
    var { token, password } = req.body;
    if (!token || !password) {
      res.json({
        confirmation: 'fail',
        message: 'Error token and password',
      });
    } else {
      User.findOne({
        where: {
          resetToken: token,
          expiryToken: { [Op.gte]: new Date(Date.now()).toISOString() },
        },
      }).then((user) => {
        if (!user) {
          return res.json({
            confirmation: 'fail',
            message: 'Token not found',
          });
        }
        if (!user.password) {
          return res.json({
            confirmation: 'fail',
            message:
              "Account of this email wasn'\t signed with a passord. Sign in with the appropriate social account",
          });
        }
        bcrypt.compare(password, user.password).then(async (isMatch, err) => {
          if (isMatch) {
            return res.json({
              confirmation: 'fail',
              message: 'Password the same as old password ',
            });
          } else {
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(password, salt, async (err, hash) => {
                try {
                  user.update({
                    password: hash,
                    resetToken: null,
                    expiryToken: null,
                  });
                  res.json({
                    confirmation: 'success',
                    message: 'password changed',
                    user,
                  });
                } catch (err) {
                  res.send(err);
                }
              });
            });
          }
        });
      });
    }
  },
  reset(req, res) {
    var { email } = req.body;
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString('hex');
      User.findOne({ where: { email: email } }).then((user) => {
        if (!user) {
          return res.json({
            confirmation: 'fail',
            message: 'Email not found',
          });
        }
        if (!user.password) {
          return res.json({
            confirmation: 'fail',
            message:
              "Account of this email wasn'\t signed with a passord. Sign in with the appropriate social account",
          });
        }
        var date = Date.now() + 3600000;

        var normalizedDate = new Date(date).toISOString();

        console.log(new Date(normalizedDate));

        user
          .update({ resetToken: token, expiryToken: normalizedDate })
          .then((result) => {
            // var forgotTemplate = jade.renderFile(
            //   __dirname,
            //   '../public/mailplates/forgot.jade',
            //   {
            //     userRecover: result.resetToken,
            //     email,
            //   }
            // );
            client.send(
              {
                from: 'no-reply@predictionleague.com',
                to: result.email,
                //cc: 'else <else@your-email.com>',
                subject: 'Forgot Password',
                attachment: [
                  {
                    data: `<p>Hello,</p>

                <p>
                  We received a request to reset the password for the Prediction League account
                  associated with ${email}.
                </p>
          
                <a href="${
                  process.env.NODE_ENV === 'production'
                    ? 'https://predictionleague.online'
                    : 'http://localhost:3000'
                }/change-password/${token}">Reset your password </a>
          
                <p>
                  If you didn’t request to reset your password, let us know by replying
                  directly to this email. No changes were made to your account yet.
                </p>
          
                <p>Need help? Contact us.</p>
                <p>Thanks,</p>
                <p>Prediction League</p>`,
                    alternative: true,
                  },
                ],
              },
              (err, message) => {
                console.log(err || 'done');
                if (err) {
                  return res.json({
                    confirmation: 'fail',
                    message: 'Error',
                  });
                }
              }
            );
          });
        return res
          .status(200)
          .json({ confirmation: 'success', message: 'Check your mail' });
      });
    });
  },
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
        if (user) {
          user
            .update({
              name: req.body.name,
            })
            .then(() => {
              res.json({
                confirmation: 'success',
                data: 'done1',
              });
            });
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
