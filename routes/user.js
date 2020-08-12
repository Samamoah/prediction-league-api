const express = require('express');
const passport = require('passport');
const router = express.Router();

const {
    getUsers,
    addUser,
    getUser,
    googleOAuth,
} = require('../controllers/user');
const passportGoogle = passport.authenticate('google', {
    scope: [
        //  'https://www.googleapis.com/auth/plus.login',
        // 'https://www.googleapis.com/auth/plus.profile.emails.read',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
    ],
});
const passportCallback = passport.authenticate('google', {
    successRedirect: 'http://localhost:5000/user/auth/google/success',
    failureRedirect: 'http://localhost:5000/user/auth/google/failure',
});

//  Get Users
router.route('/').get(getUsers);
router.route('/user/:id').get(getUser);

// Add Users
router.route('/add').post(addUser);
// router.route('/auth/google').get(passportGoogle, googleOAuth);

//router
//    .route('/auth/google')
//    .post(passport.authenticate('googleToken', { session: false }), googleOAuth);
router
    .route('/auth/google')
    .post(passport.authenticate('google-token'), googleOAuth);
//router.route('/auth/google').post(passport.authenticate('google'), googleOAuth);
router.route('/auth/google/callback').get(passportCallback);
router.route('/auth/google/success').get(googleOAuth);

module.exports = router;