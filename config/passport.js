// load passport local strategies
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;

// loads user model
var User = require('../models/user');

// loads the auth variables
var configAuth = require('./auth');

module.exports = function(passport){

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
    passport.use('local-signup', new LocalStrategy({
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
                    newUser.local.password = newUser.encryptPassword(password);

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

    //Local login
    passport.use('local-login', new LocalStrategy({
        // overwrite username field to use email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true //allows entire request to be passed back to the callback
    },

    function(req, email, password, done){

        // finds a user's email that's the same as form
        User.findOne({ 'local.email': email }, function(err, user){

            if (err)
                return done(err);

            // return message if user doesn't exist or if password is incorrect
            if (!user || !user.validPassword(password)) 
                return done(null, false, req.flash('loginMessage', 'User and/or password combination incorrect.'))
            
            //return sucessful user
            return done(null, user);
        });
    }));

    // Twitter
    passport.use(new TwitterStrategy({

        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackUrl: configAuth.twitterAuth.callbackURL,
        passReqToCallback: true //allows us to pass in the req from our route (lets us check if a user i s logged in or not)
    },
    function(req, token, tokenSecret, profile, done){
        
        process.nextTick(function(){

            if(!req.user) {
                User.findOne({ 'twitter.id': profile.id }, function(err, user){
                    // if error stop and return error
                    if(err)
                        return done(err);
                    
                    // if user is found log them in
                    if (user) {
                        return done(null, user);
                    } else {
                        //if user doesn't exist create it
                        var newUser = new User();

                        //set user data
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;

                        // saves twitter user into our database
                        newUser.save(function(err){
                            if (err)
                                throw err;
                            return
                                done(null, newUser);
                        });
                    }
                });
            } else {
                // if user already exists and is logged in, link the accounts
                var user = req.user; // pull the user from session

                //update current user with twitter credentials
                user.twitter.id = profile.id;
                user.twitter.token = token;
                user.twitter.username = profile.username;
                user.twitter.displayName = profile.displayName;

                // save the user
                user.save(function(err){
                    if(err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));

    // Google
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true //allows us to pass in the req from our route (lets us check if a user i s logged in or not)
    },

    function(req, token, refreshToken, profile, done){

        process.nextTick(function(){

            if(!req.user) {
                // try to find user based on their google id
                User.findOne({ 'google.id': profile.id }, function(err, user){
                    if(err)
                        return done(err);

                    if(user){
                        // if user is found log them in
                        return done(null, user);
                    } else {
                        //if user isn't found create it in database
                        var newUser = new User();

                        // set user data
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value; //uses the first email

                        // save the user
                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });

                } else {
                // if user already exists and is logged in, link the accounts
                var user = req.user; // pull the user from session

                //update current user with google credentials
                user.google.id = profile.id;
                user.google.token = token;
                user.google.name = profile.displayName;
                user.google.email= profile.emails[0].value;

                // save the user
                user.save(function(err){
                    if(err)
                        throw err;
                    return done(null, user);
                });
            }
        });
    }));

    passport.use(new InstagramStrategy({
        clientID: configAuth.instagramAuth.clientID,
        clientSecret: configAuth.instagramAuth.clientSecret,
        callbackURL: configAuth.instagramAuth.callbackURL,
        passReqToCallback: true //allows us to pass in the req from our route (lets us check if a user i s logged in or not)
    },

    function(req, token, refreshToken, profile, done){

        process.nextTick(function(){
            if(!req.user){
                User.findOne({ 'instagram.id': profile.id}, function (err, user){
                    if (err)
                        return done(err);

                    if(user){
                        // if user is found log them in
                        return done(null, user);
                    } else {
                        //if user isn't found create it in database
                        var newUser = new User();

                        // set user data
                        newUser.instagram.id = profile.id;
                        newUser.instagram.token = token;
                        newUser.instagram.username = profile.username;
                        newUser.instagram.displayName = profile.displayName;

                        // save the user
                        newUser.save(function(err){
                            if(err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
            });
        } else {
            //if user exists and is logged in, link the accounts
            var user = req.user // pull the user from the session

            // update current users with instagram credentials
            user.instagram.id = profile.id;
            user.instagram.token = token;
            user.instagram.username = profile.username;
            user.instagram.displayName = profile.displayName;

            user.save(function(err){
                if (err)
                    throw err;
                return (null, user);
            });
            }
        });
    }));
};