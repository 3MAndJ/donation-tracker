const router = require("express").Router();
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/login/success", (req, res) => {
  if (res.user) {
    return res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  }
  return res.send('no user');
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:8080/signin",
    failureMessage: "You have not been authenticated correctly by google",
    // successRedirect: 'http://localhost:8080/signin'
  }),
  (req, res, next) => {
    console.log(req.user);
    // return res.redirect('http://localhost:8080/auth/login/success');
    return res.json(req.user);
  }
);

module.exports = router;
