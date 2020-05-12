const db = require('../models/index');
const User = db['User'];

module.exports = {
  getUsers(req, res) {
    User.findAll({ include: ['groups', 'created'] })
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
