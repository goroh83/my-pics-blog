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



// REST ROUTES

app.get('/', function(req, res){
    res.redirect('/posts');
})

app.get('/posts', function(req, res){
    Post.find({}, function(err, posts){
        if(err) {
            console.log('error!');
        } else {
            res.render('index', {posts: posts});
        }
    });
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log('blog server is running');
});