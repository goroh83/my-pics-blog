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


// requring routes
var commentRoutes = require('./routes/comments');
var postRoutes = require('./routes/posts');
var authRoutes = require('./routes/index');


// APP CONFIG
// seedDB();
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

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   next();
});

app.use(authRoutes);
app.use(commentRoutes);
app.use(postRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('blog server is running');
});