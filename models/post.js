var mongoose = require('mongoose');

//MONGOOSE MODEL CONFIG
var postSchema = new mongoose.Schema ({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Post', postSchema); 

