const GoogleStrategy = require('passport-google-oauth2').Strategy;
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('./models');
require('dotenv').config();

const router = express.Router();


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((email, done) => {
  done(null, email);
});

// passport.deserializeUser((email, done) => {
//   db.query('SELECT * FROM users WHER email = $1', [email])
//     .then(res => {
//       done(null, email);
//     })
//     .catch(error => done(error));
// });

passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/auth/google/redirect',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      // proxy: true,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);

      const {email, id, given_name: firstName, family_name: lastName} = profile;
      const findUserQuery = `
        SELECT * FROM users
        WHERE email = $1;
      `;
      const addUserQuery = `
        INSERT INTO users (password, email, chapter_id, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING email, chapter_id, first_name, last_name;
      `;
      
      db.query(findUserQuery, [email])
      .then(async (res) => {
        if (res.rows[0]) {
          console.log('existing user: ', res.rows[0]);
          return done(null, res.rows[0]);
        } else {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(id, salt);

            db.query(addUserQuery, [password, email, 3, firstName, lastName])
              .then(res => {
                console.log(res.rows[0]);
                return done(null, res.rows[0]);
              })
              .catch(error => done(error));
          }
        })
        .catch(error => done(error));
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

module.exports = router;
