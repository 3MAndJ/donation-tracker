const GoogleStrategy = require('passport-google-oauth2').Strategy;
const express = require('express');
const passport = require('passport');

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: "590851976751-37cjhbllgiln1e0tnobg22ksn4nepuo2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return done(err, user);
      //   });
      console.log(profile);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = router;
