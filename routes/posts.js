var express = require('express');
var router  = express.Router();
var Post    = require('../models/post');


router.get('/secret', isLoggedIn, function(req, res){
   res.render('secret'); 
});

// INDEX ROUTE
router.get('/posts', function(req, res){
    Post.find({}, function(err, posts){
        if(err) {
            console.log(err);
        } else {
            res.render('posts/index', {posts: posts});
        }
    });
});

// NEW ROUTE
router.get('/posts/new',isLoggedIn, function(req, res){
    res.render('posts/new');
    
});

// CREATE ROUTE
router.post('/posts', function(req, res){
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.create(req.body.post, function(err, newPost){
        if(err) {
            res.redirect('new');
        } else {
            res.redirect('/posts');
        }
    });
});

// SHOW ROUTE
router.get('/posts/:id', function(req, res){
   Post.findById(req.params.id).populate('comments').exec(function(err, foundPost){
       if(err) {
           res.redirect('/posts');
       } else {
           res.render('posts/show', {post: foundPost});
       }
   });
});

 //-----------------------------------
//EDIT ROUTE
router.get('/posts/:id/edit',isLoggedIn, function(req, res){
   Post.findById(req.params.id, function(err, foundPost){
       if(err) {
           res.redirect('/posts');
       } else {
           res.render('posts/edit', {post: foundPost});
       }
   });
});

//UPDATE ROUTE
router.put('/posts/:id',isLoggedIn, function(req, res){
    req.body.post.body = req.sanitize(req.body.post.body);
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if(err) {
            res.redirect('/posts');
        } else {
            res.redirect(/posts/ + req.params.id);
        }
    });
});

// DELETE ROUTE
router.delete('/posts/:id',isLoggedIn, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/posts');
        } else {
            res.redirect('/posts');
        }
    });
});

//middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;