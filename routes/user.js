const express = require('express');
const passport = require('passport');
const router = express.Router();

const { getUsers, addUser } = require('../controllers/user');
const passportGoogle = passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read',
  ],
});

//  Get Users
router.route('/').get(getUsers);

// Add Users
router.route('/add').post(addUser);
router.route('/auth/google').get(passportGoogle);

module.exports = router;
