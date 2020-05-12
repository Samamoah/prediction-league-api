const express = require('express');
const router = express.Router();

const {
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  createGroup,
} = require('../controllers/group');

router.route('/').get(getGroups);

router.route('/:id').get(getGroup);

router.route('/join/:groupid/:userid').post(joinGroup);

router.route('/create').post(createGroup);

router.route('/update/:id').put(updateGroup);

router.route('/delete/:id').delete(deleteGroup);

module.exports = router;
