var bodyParser = require('body-parser'),
mongoose       = require('mongoose'),
express        = require('express'),
app            = express();


// APP CONFIG
mongoose.connect('mongodb://localhost/post');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

//MONGOOSE MODEL CONFIG
var postSchema = new mongoose.Schema ({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now}
});

var Post = mongoose.model('Post', postSchema); 

// Post.create ({
//     title: 'Evening in Hangzhou',
//     image: 'http://photo.goroh.co/wp-content/uploads/2017/02/DSC_2751.jpg',
//     body: 'West Lake area in Hangzhou.'
// });

// REST ROUTES


app.get('/', function(req, res){
    res.redirect('/posts');
})


// INDEX ROUTE
app.get('/posts', function(req, res){
    Post.find({}, function(err, posts){
        if(err) {
            console.log('error!');
        } else {
            res.render('index', {posts: posts});
        }
    });
});

// NEW ROUTE
app.get('/posts/new', function(req, res){
    res.render('new');
    
});

// CREATE ROUTE
app.post('/posts', function(req, res){
    Post.create(req.body.post, function(err, newPost){
        if(err) {
            res.redirect('new');
        } else {
            res.redirect('/posts');
        }
    });
});


// SHOUW ROUTE
app.get('/posts/:id', function(req,res){
   Post.findById(req.params.id, function(err, foundPost){
       if(err) {
           res.redirect('/posts');
       } else {
           res.render('show', {post: foundPost});
       }
   }) 
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('blog server is running');
});