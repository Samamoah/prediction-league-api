const express = require('express');
const router = express.Router();

const { sendMail } = require('../controllers/email');

//router.route('/').get(getGames);

router.route('/').get(sendMail);
// router.route('/join/:Gameid/:userid').post(joinGame);

module.exports = router;
