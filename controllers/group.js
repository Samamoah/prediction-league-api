const db = require('../models/index');
const Group = db['Group'];
const User = db['User'];

module.exports = {
  getGroups(req, res) {
    Group.findAll({ include: ['members', 'creator'] })
      .then((groups) => {
        res.json({
          confirmation: 'success',
          data: groups,
        });
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  getGroup(req, res) {
    Group.findByPk(req.params.id, { include: ['members', 'creator'] })
      .then((group) => {
        res.json({
          confirmation: 'success',
          data: group,
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
      { name: req.body.name },
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
  async joinGroup(req, res) {
    var group = await Group.findOne(
      { where: { id: req.params.groupid } },
      { include: ['members', 'creator'] }
    );

    var user = await User.findOne({ where: { id: req.params.userid } });
    await group.addMembers(user, { through: { selfGranted: false } });

    const response = await Group.findOne(
      { where: { id: req.params.groupid } },
      { include: ['members', 'creator'] }
    );
    res.json(response);
  },
  createGroup(req, res) {
    let { name, UserId } = req.body;

    Group.create({
      name,
      code: parseInt(Math.floor(100000 + Math.random() * 900000)),
      UserId,
    })
      .then(async (newgroup) => {
        var group = await Group.findOne(
          { where: { id: newgroup.id } },
          { include: ['members', 'creator'] }
        );

        var user = await User.findOne({ where: { id: UserId } });
        await group.addMembers(user, { through: { selfGranted: false } });
        res.redirect('/group');
      })
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
  deleteGroup(req, res) {
    Group.destroy({
      where: { id: req.params.id },
    })
      .then((group) => res.redirect('/group'))
      .catch((err) => {
        res.json({
          confirmation: 'fail',
          message: err,
        });
      });
  },
};
