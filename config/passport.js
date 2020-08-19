var passport = require('passport');

const db = require('../models/index');
const user = require('../controllers/user');
const User = db['User'];
const GoogleTokenStrategy = require('passport-google-token').Strategy;

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        var user = await User.findOrCreate({
		
          include: { all: true },
          where: { email: profile.emails[0].value },
          defaults: {
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.picture,
          },
        });
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(err, false);
      }

      // User.findOrCreate({
      //   include: [{ all: true }],
      //   where: { email: profile.emails[0].value },
      //   defaults: {
      //     name: profile.displayName,
      //     email: profile.emails[0].value,
      //     picture: profile.picture,
      //   },
      // })
      //   .spread((user, created) => {
      //     return done(null, user);
      //   })
      //   .catch((err) => {
      //     return done(err, false, error.message);
      //   });
      //   User.findOrCreate({
      //     include: [{ all: true }],
      //     where: { email: profile.emails[0].value },
      //     defaults: {
      //       name: profile.displayName,
      //       email: profile.emails[0].value,
      //       picture: profile.picture,
      //     },
      //   }, (err, user) => {

      //     return done(null, user);
      //   })
      //   return done(err, false, error.message);
      // });
      //     .spread((user, created) => {
      //     })
      //     .catch((err) => {
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
