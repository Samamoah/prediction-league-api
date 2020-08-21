var passport = require('passport');

const db = require('../models/index');
const user = require('../controllers/user');
const User = db['User'];
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const TwitterTokenStrategy = require('passport-twitter-token');

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
    }
  )
);
passport.use(
  new TwitterTokenStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,

      includeEmail: true,
    },
    async (token, tokenSecret, profile, done) => {
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
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
