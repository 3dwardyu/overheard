var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Login
router.get('/login', function (req, res, next) {
  res.render('login.ejs', {message: req.flash('loginMessage') })
});

// Signup

router.get('/signup', function (req, res, next) {
  res.render('signup.ejs', { message: req.flash(signupMessage) })
});

// Profile
router.get('/profile', isLoggedIn, function(req, res, next){
  res.render('profile.ejs', {
    user : req.user
  });
});


// Logout
router.get('/logout', function (req, res, next){
  req.logout();
  res.redirect('/');
});

// route to make sure user is logged in
function isLoggedIn (req, res, next) {
  //if usre is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to root
  res.redirect('/');
}


module.exports = router;
