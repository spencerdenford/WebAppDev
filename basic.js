let express = require("express");
let app = express();

let session = require('express-session');
let bodyParser = require('body-parser');
let uuid = require('uuid/v1');
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

// database config
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/bookface', {
  useNewUrlParser: true
},
  function (error) {
    if (error) {
      return console.error('Unable to connect:', error);
    }
  }
);
mongoose.set('useCreateIndex', true);

// middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended: false
}));

// configure sessions
app.use(session({
  genid: function(request) {
     return uuid();
  },
  resave: false,
  saveUninitialized: false,
  // cookie: {secure: true},
  secret: 'apollo slackware prepositional expectations'
}));

// database schemas
let Schema = mongoose.Schema;

let userSchema = new Schema({
   username: {
      type: String,
      unique: true,
      index: true
   },
   email: String,
   hashedPassword: String,
   birthday: String,
   gender: String,
   friendsList: [{type: String, unique: true}]
}, {
   collection: 'users'
});
let User = mongoose.model('user', userSchema);

let postSchema = new Schema({
    username: String,
    postContent: String
}, { 
    collection: 'posts' 
});
let Post = mongoose.model('posts', postSchema);

// routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/login.html');
});

app.get('/login', (request, response) => {
  response.sendFile(__dirname + '/public/login.html');
});

app.get('/createAccount', (request, response) => {
  response.sendFile(__dirname + '/public/createAccount.html');
});

app.get('/home', (request, response) => {
  response.sendFile(__dirname + '/public/bookFace.html');
});

app.get('/api', function (req, res) {
  res.send('{"username": "spec7", "text": "bookface lol", "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvMH7RDi7o82e4rg49UmWA2ipwckVcmjLv2MQJMadRLMh_GDH_"}');
});

app.post('/postButton', function(req, res){
  console.log("HERE");
  //var body = req.body;
  console.log(req.body.textfield);
  //Post.add({username: "default", postContent: req.body.textfield});
  
  newPost = new Post({
    username: "default",
    postContent: req.body.textfield,
  });

  newPost.save(function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("save success");
    }
  });

  //res.send("localhost:3000/home");
  
});

// web listener
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
   console.log('Server listening on port ' + app.get('port'));
});