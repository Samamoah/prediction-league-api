const JWT = require('jsonwebtoken');
const db = require('../models/index');
const User = db['User'];

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
      console.log(req.user[0]);
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

  awardedPoints(){
    
  }

  //   addUser(req, res) {
  //     const data = {
  //       name: 'goat',
  //       email: 'goat@gmail.com',
  //       picture: 'ghhghghg',
  //     };

  //     let { name, email, picture } = data;

  //     User.create({
  //       name,
  //       email,
  //       picture,
  //     })
  //       .then((user) => res.redirect('/user'))
  //       .catch((err) => {
  //         res.json({
  //           confirmation: 'fail',
  //           message: err,
  //         });
  //       });
  //   },
};
