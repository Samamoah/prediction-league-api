const express = require('express');
const ejwt = require('express-jwt');
const router = express.Router();

const {
  getGame,
  getGames,
  createGame,
  getCompetition,
  getGameOnline,
  getOnlineGames,
  awardPoints,
} = require('../controllers/game');

//router.route('/').get(getGames);

router
  .route('/competition')
  .get(ejwt({ secret: process.env.JWT_SECRET }), getCompetition);
router
  .route('/online')
  .get(ejwt({ secret: process.env.JWT_SECRET }), getOnlineGames);
// router.route('/join/:Gameid/:userid').post(joinGame);

router
  .route('/create')
  .post(ejwt({ secret: process.env.JWT_SECRET }), createGame);
router.route('/award').put(awardPoints);
router
  .route('/online/:game')
  .get(ejwt({ secret: process.env.JWT_SECRET }), getGameOnline);
router.route('/:id').get(ejwt({ secret: process.env.JWT_SECRET }), getGame);
router.route('/').get(ejwt({ secret: process.env.JWT_SECRET }), getGames);

module.exports = router;
