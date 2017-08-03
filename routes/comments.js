var express = require('express');
var router  = express.Router();
var Post    = require('../models/post');
var Comment    = require('../models/comment');
var middleware  = require('../middleware');  // files is named index.js so after middleware it's found automatically

// ======= comments routes ========
// new comment form
router.get('/posts/:id/comments/new', middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {post: post});
         }
    });     
});


// create comment
router.post('/posts/:id/comments', middleware.isLoggedIn, function(req, res) {
    Post.findById(req.params.id, function(err, post){
        if(err){
            req.flash('error', 'Ooops! Something went wrong...');
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
                    req.flash('success', 'Successfully added a comment');
                    res.redirect('/posts/' + post._id);
                }
            });
        }
    });
});

// EDIT comment
router.get('/posts/:id/comments/:comment_id/edit', middleware.checkCommentAuthor, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err) {
            res.redirect('back');
        } else {
            res.render('comments/edit', {post_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE
router.put('/posts/:id/comments/:comment_id', middleware.checkCommentAuthor, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/posts/' + req.params.id);
        }
    });
});

// DESTROY
router.delete('/posts/:id/comments/:comment_id', middleware.checkCommentAuthor, function(req, res){
    // finad and destroy
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err){
            res.redirect('back');
        } else {
            req.flash('success', 'comment deleted.');
            res.redirect('/posts/' + req.params.id);
        }   
    });    
});

module.exports = router;