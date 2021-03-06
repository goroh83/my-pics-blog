var express = require('express');
var router  = express.Router();
var passport = require('passport');
var User = require('../models/user');

// root route
router.get('/', function(req, res){
    res.redirect('/posts');
});

// AUTH ROUTES

//show sign up form
router.get('/register', function(req, res){
   res.render('register'); 
});

//handling user sign up
router.post('/register', function(req, res){
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash('error', err.message);
           return res.redirect("/register");
       }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome ' + user.username);
            res.redirect('/secret');
        });
   });
});

//LOGIN ROUTES
//show login form
router.get('/login', function(req, res){
   res.render('login'); 
});

//login logic
//MIDDLEWARE- code that runs b4 final route callback function
router.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
    }) ,function(req, res){
});

//logout
router.get('/logout', function(req, res){
   req.logout();
   req.flash('success', 'Logged you out!');
    res.redirect('/posts');
});

module.exports = router;