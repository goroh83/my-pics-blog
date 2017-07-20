var  expressSanitizer   = require('express-sanitizer'),
methodOverride          = require('method-override'),
mongoose                = require('mongoose'),
express                 = require('express'),
app                     = express(),
Post                    = require('./models/post'),
Comment                 = require('./models/comment'),
seedDB                  = require('./seeds'),
passport                = require('passport'),
bodyParser              = require('body-parser'),
User                    = require('./models/user'),
LocalStrategy           = require('passport-local'),
passportLocalMongoose   = require('passport-local-mongoose');
// Comment                 = require('./models/comment'),
// User                    = require('./models/user');

// APP CONFIG
seedDB();
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/post');
app.use(require('express-session')({
    secret: 'Goroh is bald',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// REST ROUTES
app.get('/', function(req, res){
    res.redirect('/posts');
});

app.get('/secret', function(req, res){
   res.render('secret'); 
});

// Auth routes

//show sign up form
app.get('/register', function(req, res){
   res.render('register'); 
});


//handling user sign up
app.post('/register', function(req, res){
   req.body.username;
   req.body.password;
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render('register');
       }
           passport.authenticate('local')(req, res, function(){
               res.redirect('/secret');
        });
   });
});


//LOGIN ROUTES
//render login form
app.get('/login', function(req, res){
   res.render('login'); 
});


//login logic
//middleware- code that runs b4 final route callback
app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}) ,function(req, res){
    
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