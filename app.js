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

app.get('/posts', function(req, res){
    res.render('index');
})



app.listen(process.env.PORT, process.env.IP, function(){
    console.log('blog server is running');
});