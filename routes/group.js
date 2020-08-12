const express = require('express');
const router = express.Router();

const {
  getGroups,
  getGroup,
  searchGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  joinGroupByCode,
  createGroup,
} = require('../controllers/group');

//router.route('/join/:groupid/:userid').post(joinGroup);
router.route('/join/:code/:UserId').post(joinGroupByCode);

router.route('/create').post(createGroup);

router.route('/update/:id').put(updateGroup);

router.route('/delete/:id').delete(deleteGroup);
router.route('/:id').get(getGroup);
router.route('/:term').get(searchGroup);
router.route('/').get(getGroups);

module.exports = router;
