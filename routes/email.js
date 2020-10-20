const express = require('express');
const router = express.Router();

const { sendMatchdayMail, sendPointsMail } = require('../controllers/email');

//router.route('/').get(getGames);

router.route('/matchday').post(sendMatchdayMail);
router.route('/points').post(sendPointsMail);
// router.route('/join/:Gameid/:userid').post(joinGame);

module.exports = router; 
