var  expressSanitizer   = require('express-sanitizer'),
methodOverride          = require('method-override'),
bodyParser              = require('body-parser'),
mongoose                = require('mongoose'),
express                 = require('express'),
app                     = express(),
Post                    = require('./models/post'),
Comment                 = require('./models/comment'),
seedDB                  = require('./seeds'),
passport                = require('passport'),
LocalStrategy           = require('passport-local'),
passportLocalMongoose   = require('passport-local-mongoose'),
user                    = require('./models/user');
// Comment                 = require('./models/comment'),
// User                    = require('./models/user');

// APP CONFIG
seedDB();
mongoose.connect('mongodb://localhost/post');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method')),
app.use(passport.initialize()),
app.use(passport.session());

// REST ROUTES
app.get('/', function(req, res){
    res.redirect('/posts');
});

// INDEX ROUTE
app.get('/posts', function(req, res){
    Post.find({}, function(err, posts){
        if(err) {
            console.log('error!');
        } else {
            res.render('posts/index', {posts: posts});
        }
    });
});

// NEW ROUTE
app.get('/posts/new', function(req, res){
    res.render('posts/new');
    
});

// CREATE ROUTE
app.post('/posts', function(req, res){
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
app.get('/posts/:id', function(req,res){
   Post.findById(req.params.id).populate('comments').exec(function(err, foundPost){
       if(err) {
           res.redirect('/posts');
       } else {
           res.render('posts/show', {post: foundPost});
       }
   });
});

//EDIT ROUTE
app.get('/posts/:id/edit', function(req, res){
   Post.findById(req.params.id, function(err, foundPost){
       if(err) {
           res.redirect('/posts');
       } else {
           res.render('posts/edit', {post: foundPost});
       }
   });
});

//UPDATE ROUTE
app.put('/posts/:id', function(req, res){
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
app.delete('/posts/:id', function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/posts');
        } else {
            res.redirect('/posts');
        }
    });
});


// ======= comments routes ========
app.get('/posts/:id/comments/new', function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {post: post});
         }
    });     
});

app.post('/posts/:id/comments', function(req, res) {
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
            res.redirect('/posts');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/posts/' + post._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('blog server is running');
});