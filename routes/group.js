const express = require('express');
const ejwt = require('express-jwt');
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
  getUserGroups,
} = require('../controllers/group');

router
  .route('/authuser/:id')
  .get(ejwt({ secret: process.env.JWT_SECRET }), getUserGroups);
router
  .route('/join/:code/:UserId')
  .post(ejwt({ secret: process.env.JWT_SECRET }), joinGroupByCode);
router
  .route('/joingroup/:GroupId/:UserId')
  .post(ejwt({ secret: process.env.JWT_SECRET }), joinGroup);

router
  .route('/create')
  .post(ejwt({ secret: process.env.JWT_SECRET }), createGroup);

router
  .route('/update/:id')
  .put(ejwt({ secret: process.env.JWT_SECRET }), updateGroup);

router
  .route('/delete/:id')
  .delete(ejwt({ secret: process.env.JWT_SECRET }), deleteGroup);
router
  .route('/search/:term')
  .get(ejwt({ secret: process.env.JWT_SECRET }), searchGroup);
router.route('/:id').get(getGroup);
router.route('/').get(getGroups);

module.exports = router;
