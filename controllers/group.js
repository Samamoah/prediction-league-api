const sequelize = require('sequelize');
const Op = sequelize.Op;
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
  async getUserGroups(req, res) {
    try {
      var user = await User.findOne({ where: { id: req.params.id } });
      var groups = await Group.findAll({
        include: ['members', 'creator'],
      });

      var newgroups = groups.filter((group) => group.hasMembers(user));

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
      { where: { id: req.params.GroupId } },
      { include: ['members', 'creator'] }
    );

    var user = await User.findOne({ where: { id: req.params.UserId } });
    var join = await group.addMembers(user, {
      through: { selfGranted: false },
    });

    const response = await Group.findOne(
      { where: { id: req.params.GroupId } },
      { include: ['members', 'creator'] }
    );
    res.json(join);
  },
  async joinGroupByCode(req, res) {
    try {
      var group = await Group.findOne(
        { where: { code: req.params.code } },
        { include: ['members', 'creator'] }
      );

      var user = await User.findOne({ where: { id: req.params.UserId } });
      var join = await group.addMembers(user, {
        through: { selfGranted: false },
      });

      const response = await Group.findOne(
        { where: { code: req.params.code } },
        { include: ['members', 'creator'] }
      );
      console.log(join);
      res.json(join);
    } catch (error) {
      res.json({
        confirmation: 'fail',
        message: error.message,
      });
    }
  },
  async searchGroup(req, res) {
    try {
      //   var regex = new RegExp(req.params.term);
      var groups = await Group.findAll({
        // where: { name: { [Op.startsWith]: req.params.term } },
        where: { name: { [Op.iLike]: '%' + req.params.term + '%' } },
      });
      res.json({
        confirmation: 'success',
        data: groups,
      });
    } catch (error) {
      res.json({
        confirmation: 'fail',
        message: error.message,
      });
    }
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
        res.json({
          confirmation: 'success',
          message: 'created',
        });
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
