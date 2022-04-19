const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/login/success', (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: 'successful',
      user: req.user,
    });
  }
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/chapters',
    failureRedirect: 'http://localhost:3000/signin',
  })
);

module.exports = router;