const router = require('express').Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/redirect', passport.authenticate('google', {
  successRedirect: '/dashboard'
}), (req, res) => {
  console.log('redirect');
  const {password, ...publicUserData} = req.user;
  return res.send(publicUserData);
  // return res.redirect('http://localhost:8080/signin');
});


module.exports = router;
