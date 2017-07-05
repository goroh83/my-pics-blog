var mongoose = require('mongoose');
var Post     = require('./models/post');
var Comment  = require('./models/comment');

var data = [
    { 
        title: 'Shanghai nights', 
        image:'http://photo.goroh.co/wp-content/uploads/2017/02/DSC_3899.jpg',
        body: 'Early morning view of Pudong district, Shanghai.'
    },
    { 
        title: 'YuYuan gardens', 
        image:'http://photo.goroh.co/wp-content/uploads/2017/02/DSC_2827.jpg',
        body: 'Evening at YuYuan gardens- popular tourist destination'
    },
    { 
        title: 'Evening Hong Kong Bay', 
        image:'http://photo.goroh.co/wp-content/uploads/2017/02/P7291268.jpg',
        body: 'View form Tsim Sha Tsui over HK bay'
    }
];

function seedDB(){
    // remove posts
    Post.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log('removed posts');
        // add few posts
        data.forEach(function(seed){
            Post.create(seed, function(err, post){
                if(err){
                    console.log(err);
                } else {
                    console.log('added a post');
                    // create comment
                    Comment.create(
                        {
                            text: 'This photo is great, good job Peter ;)',
                            author: 'Peter'
                        }, function(err, comment){
                            if(err) {
                                console.log(err);
                            } else {
                            post.comments.push(comment);
                            post.save();
                            console.log('creacted new comment');
                            }
                        });
                }
            });
        });
    }); 
}

module.exports = seedDB;


