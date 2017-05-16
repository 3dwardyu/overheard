
module.exports = function (app, passport){
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('index.ejs');
  });
//////////////////////////////////////////////////////////////////////
//  AUTHENTICATE (First Login)
//////////////////////////////////////////////////////////////////////

  // LOCAL LOGIN
  app.get('/login', function (req, res, next) {
    res.render('login.ejs', {message: req.flash('loginMessage') })
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // LOCAL SIGNUP
  app.get('/signup', function (req, res, next) {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  // PROFILE
  app.get('/profile', isLoggedIn, function(req, res, next){
    res.render('profile.ejs', {
      user : req.user
    });
  });

  // LOGOUT
  app.get('/logout', function (req, res, next){
    req.logout();
    res.redirect('/');
  });

  // Routes for Twitter
  // route for twitter authentication and login
  app.get('/auth/twitter', passport.authenticate('twitter'));

  //handle callback after twitter authenicated the user
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter',{
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  //Routes for Google
  // route for google authentication and login
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  // handle callback after google authenticated the user
  app.get('/auth/google/callback',
    passport.authenticate('google',{
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

  //Routes for Instagram
  // route for instagram authentication and login
  app.get('/auth/instagram', passport.authenticate('instagram'));

  // handle callback after google authenticated the user
  app.get('/auth/instagram/callback',
    passport.authenticate('instagram',{
      successRedirect: '/profile',
      failureRedirect: '/'
    }));

/////////////////////////////////////////////////////////////////////////
// AUTHORIZE (Already logged in/ Connecting other social media accounts)
/////////////////////////////////////////////////////////////////////////

// LOCAL
  app.get('/connect/local', function (req,res){
    res.render('connect-local.ejs', {message: req.flash('loginMessage') });
  });

  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/',
  }));

};

// route to make sure user is logged in
function isLoggedIn (req, res, next) {
  //if usre is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to root
  res.redirect('/');
}


