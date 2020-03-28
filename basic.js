let express = require("express");
let path = require('path');

let app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public');
});

app.get('/api', function (req, res) {
  res.send('{"username": "spec7", "text": "bookface lol", "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQvMH7RDi7o82e4rg49UmWA2ipwckVcmjLv2MQJMadRLMh_GDH_"}');
});

app.set('port', 3000);

app.listen(app.get('port'), () => {
  console.log(`Listening to requests on http://localhost:3000`);
});