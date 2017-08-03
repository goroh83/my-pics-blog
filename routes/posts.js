var express     = require('express');
var router      = express.Router();
var Post        = require('../models/post');
var middleware  = require('../middleware');  // files is named index.js so after middleware it's found automatically


router.get('/secret', middleware.isLoggedIn, function(req, res){
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
router.get('/posts/new', middleware.isLoggedIn, function(req, res){
    res.render('posts/new');
    
});

// CREATE ROUTE
router.post('/posts', function(req, res){
    var title = req.body.title;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPost = {title: title, image: image, price: price, desc: desc, author: author};
    Post.create(newPost, function(err, newlyCreated){
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

//EDIT ROUTE
router.get('/posts/:id/edit', middleware.checkPostAuthor, function(req, res){
        Post.findById(req.params.id, function(err, foundPost){
            res.render('posts/edit', {post: foundPost});
        });
});

//UPDATE ROUTE
router.put('/posts/:id', middleware.checkPostAuthor, function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if(err) {
            res.redirect('/posts');
        } else {
            res.redirect(/posts/ + req.params.id);
        }
    });
});

// DELETE ROUTE
router.delete('/posts/:id', middleware.checkPostAuthor, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/posts');
        } else {
            res.redirect('/posts');
        }
    });
});

module.exports = router;