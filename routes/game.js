const express = require('express');
const router = express.Router();

const {
  getGame,
  createGame,
  getCompetition,
  getGames,
} = require('../controllers/game');

//router.route('/').get(getGames);

router.route('/competition').get(getCompetition);
// router.route('/join/:Gameid/:userid').post(joinGame);

router.route('/create').post(createGame);
router.route('/:id').get(getGame);
router.route('/').get(getGames);

module.exports = router;
