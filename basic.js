let express = require("express");
let app = express();

/*
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
*/

let session = require('express-session');
let bodyParser = require('body-parser');
let uuid = require('uuid/v1');
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

//var express = require('express');    //Express Web Server 
var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
app.use(busboy());

/*
const fileUpload = require('express-fileupload');
app.use(fileUpload());
*/

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
  time: Date,
  username: String,
  postText: String,
  imageURL: String,
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

app.get('/messages', (request, response) => {
  response.sendFile(__dirname + '/public/messages.html');
});

app.get('/api', async function (req, res) {
  var array = await mongoose.connection.db.collection('posts').find({}).toArray();
  //console.log(array[0]);
  res.send(array);
  //console.log("Post.find():");
  //console.log(Post.find({}));
  //res.send(Post.find({}));
  //res.send('{"username": "spec7", "text": "bookface lol", "imageURL":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvMH7RDi7o82e4rg49UmWA2ipwckVcmjLv2MQJMadRLMh_GDH_"}');
});

app.get('/news', (request, response) => {
  response.sendFile(__dirname + '/public/news.html');
});

// add post to posts collection when user clicks post
app.post('/postButton', function(req, res){
  // get the post text
  var postText = "";
  req.busboy.on('field', function (fieldname, val) {
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
      username: "default",
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
});

//TODO - Check if a text field is NULL, if so, don't create account
app.post('/createAccount', (request, response) => {
  username = request.body.username;
  email = request.body.email;
  password = request.body.password;
  hashedPassword = bcrypt.hashSync(password);
  birthday = request.body.birthday;

  //Assigning gender from radio button input
  if(request.body.Female == "Female") {
    gender = request.body.Female;
  }
  else if (request.body.Male == "Male") {
    gender = request.body.Male;
  }
  else if (request.body.Other == "Other") {
    gender = request.body.Other;
  }

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
          response.sendFile(__dirname + '/public/createAccountSuccess.html')
        }
      });
    }  
  });
});

app.post('/processLogin', (request, response) => {
  username = request.body.username;
  password = request.body.password;

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
