// load passport local strategies
var LocalStrategy = require('passport-local').Strategy;

// loads user model
var User = require('../models/user');

//used to serialize the user for the session
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//used to deserialize the user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

//Local signup
passport.use('local.signup', new LocalStrategy({
    // overwrite username field to use email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //allows entire request to be passed back to the callback
},
function(req, email, password, done){

    process.nextTick(function(){

        // check if user is trying to login exists
        User.findOne({ 'local.email': email }, function(err, user){

            if (err)
                return done(err);

            // check to see if there's already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
            } else {

                //if there is no user, create one
                var newUser = new User();

                // set user's credentials
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err){
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    });
}));

module.exports = passport;