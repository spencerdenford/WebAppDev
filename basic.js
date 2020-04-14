let express = require("express");
let app = express();

let session = require('express-session');
let bodyParser = require('body-parser');
let uuid = require('uuid/v1');
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
var ObjectId = require('mongodb').ObjectID;

var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
app.use(busboy());


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
  //friendsList: [{type: String, sparse: true}]
}, {
  collection: 'users'
});
let User = mongoose.model('user', userSchema);

let postSchema = new Schema({
  time: Date,
  username: String,
  postText: String,
  imageURL: String,
  likes: [String],
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

app.get('/logout', (request, response) => {
  console.log("logout");
  request.session.username = undefined;
  response.redirect('/login');
});

app.get('/createAccount', (request, response) => {
  response.sendFile(__dirname + '/public/createAccount.html');
});

app.get('/home', (request, response) => {
  if(request.session.username != undefined){
    response.sendFile(__dirname + '/public/bookFace.html');
  }else{
    response.redirect('/login');
  }
});

app.post('/like', async function(request, response){
  var postID = request.body.postID;
  var username = request.session.username;
  var post = await mongoose.connection.db.collection('posts').findOne({_id: ObjectId(postID)});
  var likes = post['likes'];
  if(likes.includes(username)){
    likes = likes.filter(function (u) { return u !== username })
    mongoose.connection.db.collection('posts').updateOne({ _id: ObjectId(postID) }, { $set: { likes: likes } });
  } else{
    likes.push(username);
    mongoose.connection.db.collection('posts').updateOne({_id: ObjectId(postID)}, { $set: {likes: likes}});
  }
  // keep for debugging:
  //post = await mongoose.connection.db.collection('posts').findOne({ _id: ObjectId(postID) });
  //console.log(post['likes']);
  response.redirect('home');
});

app.get('/messages', (request, response) => {
  response.sendFile(__dirname + '/public/messages.html');
});

app.get('/api', async function (req, res) {
  // TODO: only send posts from follows
  var array = await mongoose.connection.db.collection('posts').find().toArray();
  res.send(array);
});

app.get('/getUserPosts', async function (req, res) {
  //console.log('profile view: ' + req.query.user);
  var user = req.query.user;
  var array = await mongoose.connection.db.collection('posts').find({ username: user}).toArray();
  res.send(array);
});

app.get('/news', (request, response) => {
  response.sendFile(__dirname + '/public/news.html');
});

app.get('/profile', (request, response) => {
  user = request.query.user;
  if (user == undefined || user == "") {
    response.redirect('/profile?user=' + request.session.username);
    //user = req.session.username;
  }
  response.sendFile(__dirname + '/public/profile.html');
});

// add post to posts collection when user clicks post
app.post('/postButton', function(req, res){
  // get the post text
  var postText = "";
  req.busboy.on('field', function (fieldname, val) {
    console.log('field:');
    console.log(val);
    postText = val;
  });
  
  // add post to database
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    // if a file was uploaded, save file
    if(filename != ""){
      console.log("Uploading: " + filename);
      //Path where image will be uploaded
      var fstream = fs.createWriteStream(__dirname + '/public/images/useruploads/' + filename);
      file.pipe(fstream);
      fstream.on('close', function(){
        console.log("Upload Finished of " + filename);
      });
    }
    // add post to posts collection
    newPost = new Post({
      time: Date.now(),
      username: req.session.username,
      postText: postText,
      imageURL: filename,
    });
    newPost.save(function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log("save success");
      }
    });
  });
  //res.send("localhost:3000/home");
  res.redirect('back');
});

app.post('/createAccount', (request, response) => {
  username = request.body.username;
  email = request.body.email;
  password = request.body.password;
  hashedPassword = bcrypt.hashSync(password);
  birthday = request.body.birthday;
  gender = request.body.genderAnswer;

  console.log(username);
  console.log(email);
  console.log(password);
  console.log('Hashed password:', hashedPassword);
  console.log(birthday);
  console.log(gender);

  userData = {
    username: username,
    email: email,
    hashedPassword: hashedPassword,
    birthday: birthday,
    gender: gender
  }

  User.find({
    username: username
  }).then(function(results) {
    //User doesn't already exist
    if(results.length == 0) {
      newUser = new User(userData);
      newUser.save(function(error) {
        if (error) {
          console.log("Error adding user: ", error);
          response.sendFile(__dirname + '/public/createAccountFailure.html')
        } else {
          console.log("User added");
          request.session.username = username;
          console.log("Session Username: " + request.session.username); //Testing
          response.sendFile(__dirname + '/public/createAccountSuccess.html')
        }
      });
    }  
  });
});

app.post('/processLogin', (request, response) => {
  username = request.body.username;
  password = request.body.password;

  console.log(username);
  console.log(password);

  User.find({username: username}).then(function(results) {
    if (results.length != 1) {
       console.log('login: no user found');
       //Error logging in - user doesn't exist, load failure page
       response.sendFile(__dirname + '/public/loginFailure.html')
    } else {
       //User was found, now check the password
       console.log('login password:', results[0].hashedPassword);
       if (bcrypt.compareSync(password, results[0].hashedPassword)) {
          //Password match - successful login, load success page
          request.session.username = username;
          console.log("Session Username: " + request.session.username); //Testing
          response.sendFile(__dirname + '/public/loginSuccess.html')  
       } else {
          console.log('login: password is not a match');
          //Error logging in - invalid password, load failure page
          response.sendFile(__dirname + '/public/loginFailure.html')
       }
    }
 }).catch(function(error) {
    //Error logging in - user doesn't exist, load failure page
    console.log('login: catch');
    response.sendFile(__dirname + '/public/loginFailure.html')
 });
});

// web listener
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});
