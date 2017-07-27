var express = require('express');
var router  = express.Router();
var Post    = require('../models/post');
var Comment    = require('../models/comment');


// ======= comments routes ========
// new comment form
router.get('/posts/:id/comments/new', isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {post: post});
         }
    });     
});


// create comment
router.post('/posts/:id/comments', isLoggedIn, function(req, res) {
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
            res.redirect('/posts');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/posts/' + post._id);
                }
            });
        }
    });
});


// EDIT comment
router.get('/posts/:id/comments/:comment_id/edit', function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {post_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE
router.put('/posts/:id/comments/:comment_id', function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    });
});

// DESTROY
router.delete('/posts/:id/comments/:comment_id', function(req, res){
    // finad and destroy
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/posts/' + req.params.id);
        }   
    });    
});

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;