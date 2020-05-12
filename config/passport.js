var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Client_ID,
      clientSecret: process.env.Client_SECRET,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOrCreate({
        where: { GoogleId: profile.id },
        defaults: {
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.picture,
        },
      })
        .spread((user, created) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err, null);
        });
    }
  )
);
