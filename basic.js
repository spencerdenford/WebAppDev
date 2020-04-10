let express = require("express");
let app = express();

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

let session = require('express-session');
let bodyParser = require('body-parser');
let uuid = require('uuid/v1');
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

const fileUpload = require('express-fileupload');
app.use(fileUpload());

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
    postContent: String,
    imageURL: String,
    image: Buffer,
    imageD: String,
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

  res.send('{"username": "spec7", "text": "bookface lol", "imageURL":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvMH7RDi7o82e4rg49UmWA2ipwckVcmjLv2MQJMadRLMh_GDH_"}');
});

app.post('/postButton', function(req, res){
  console.log("HERE");
  //var body = req.body;
  //console.log(req.body.textfield);
  //Post.add({username: "default", postContent: req.body.textfield});
  //console.log(req.body.filetoupload);
  //console.log(req.body.filetoupload['0']);
  //console.log(Object.keys(req.files));

  // Express file upload
  /*
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let filetoupload = req.files.filetoupload;
  // Use the mv() method to place the file somewhere on your server
  filetoupload.mv('C:/code/WebApps/WebAppDev/public/images/useruploads/' + req.body.filetoupload, function (err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded!');
  });
  */


  // Formidable file upload
  /*
  var form = new formidable.IncomingForm();
  form.on('error', function (err) { console.log(err); });
  form.on('aborted', function () { console.log('Aborted'); });
  form.parse(req, function (err, fields, files) {
    console.log("here");
    var oldpath = files.filetoupload.path;
    console.log("oldpath");
    var newpath = 'C:/code/WebApps/WebAppDev/public/images/' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write('File uploaded and moved!');
      res.end();
    });
  });
  */

  newPost = new Post({
    username: "default",
    postContent: req.body.textfield,
    imageURL: req.body.filetoupload,
    //image: req.body.filetoupload,
    //imageD: req.body.filetoupload,
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

app.post('/createAccount', (request, response) => {
  username = request.body.username;
  email = request.body.email;
  password = request.body.password;
  hashedPassword = bcrypt.hashSync(password);
  birthday = request.body.birthday;

  if(request.body.Female == "Female") {
    gender = request.body.Female;
  }
  else if (request.body.Male == "Male") {
    gender = request.body.Male;
  }
  else if (request.body.Other == "Other") {
    gender = request.body.Other;
  }

  /*
  console.log(username);
  console.log(email);
  console.log(password);
  console.log('Hashed password:', hashedPassword);
  console.log(birthday);
  console.log(gender);
  */

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
        } else {
          console.log("User added");
        }
      });
    }  
  });
});

// web listener
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port'));
});