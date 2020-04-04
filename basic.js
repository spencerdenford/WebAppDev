let express = require("express");
let path = require('path');
let app = express();

// database config
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

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

// database schema
let postSchema = new mongoose.Schema(
  {
    username: String,
    postContent: String
  },
  { collection: 'posts' }
);
let posts = mongoose.model('post', postSchema);



app.use(express.static(__dirname + '/public'));

app.get('/home', (request, response) => {
  response.sendFile(__dirname + '/public/bookFace.html');
});

app.get('/api', function (req, res) {
  res.send('{"username": "spec7", "text": "bookface lol", "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvMH7RDi7o82e4rg49UmWA2ipwckVcmjLv2MQJMadRLMh_GDH_"}');
});

app.get('/postButton', function(req, res){
  console.log(req.body);
  posts.add({username: "default", postContent: req.body});
});

app.set('port', 3000);

app.listen(app.get('port'), () => {
  console.log(`Listening to requests on http://localhost:3000`);
});