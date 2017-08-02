var methodOverride      = require('method-override'),
mongoose                = require('mongoose'),
flash                   = require('connect-flash'),
express                 = require('express'),
app                     = express(),
Post                    = require('./models/post'),
Comment                 = require('./models/comment'),
passport                = require('passport'),
bodyParser              = require('body-parser'),
User                    = require('./models/user'),
LocalStrategy           = require('passport-local'),
passportLocalMongoose   = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

// requring routes
var commentRoutes = require('./routes/comments');
var postRoutes = require('./routes/posts');
var authRoutes = require('./routes/index');


// APP CONFIG
// seedDB();
mongoose.connect('mongodb://localhost/post'); //  , {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT config
app.use(require('express-session')({
    secret: 'Goroh is bald',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// add currentUser property to every page
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});

app.use(authRoutes);
app.use(commentRoutes);
app.use(postRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('blog server is running');
});