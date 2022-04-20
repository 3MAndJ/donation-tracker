const GoogleStrategy = require('passport-google-oauth2').Strategy;
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('./models');

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: "590851976751-37cjhbllgiln1e0tnobg22ksn4nepuo2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
      store: true
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log('profile in strategy: ', profile);
      return done(null, profile);
    //   const queryString = `
    //     INSERT INTO users (password, email, chapter_id, first_name, last_name)
    //     VALUES ($1, $2, $3, $4, $5);
    //   `;
    //   const {email, id, given_name: firstName, family_name: lastName} = profile;
    //   const salt = await bcrypt.genSalt(10);
    //   const password = await bcrypt.hash(id, salt);
      
    //   try {
    //     const userResult = await db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
    //     if (!userResult) {
    //       try {
    //         const result = await db.query(queryString, [password, email, 3, firstName, lastName]);
    //         return done(null, profile);
    //       } catch (error) {
    //         console.log(error);
    //         return done(error);
    //       }
    //     }
    //     console.log('user found')
    //     return done(null, profile);
    //   } catch (error) {
    //     console.log(error);
    //     return done(error);
    //   }
    }
  )
);

// async function (request, accessToken, refreshToken, profile, done) {
//   const queryString = `
//     INSERT INTO users (password, email, chapter_id, first_name, last_name)
//     VALUES ($1, $2, $3, $4, $5);
//   `;
//   const {email, id, given_name: firstName, family_name: lastName} = profile;
//   const salt = await bcrypt.genSalt(10);
//   const password = await bcrypt.hash(id, salt);
//   request.user = {email: email};
//   console.log('request.user within passport.js: ', request.user);
//   // remove the line below when comments are active
//   // return done(null, profile);
  
//   try {
//     const result = await db.query(queryString, [password, email, 3, firstName, lastName]);
//     return done(null, profile);
//   } catch (error) {
//     console.log(error);
//     return done(error);
//   }
  
// }

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = router;
