conn = new Mongo();
db = conn.getDB("bookface");

// clear database contents
db.users.remove({});
db.posts.remove({});

// insert users
db.users.insertOne({
  username: "spencerspencerdenford",
  email: "spencer.spencer@denford.org",
  hashedPassword: hex_md5("IMtheRealSpecSeven"),
  birthday: Date.now(),
  gender: "Male",
  profilePic: "spec7.png",
});

db.users.insertOne({
  username: "prison_mike",
  email: "prison.mike@dundermifflin.com",
  hashedPassword: hex_md5("imprisonmike"),
  birthday: Date.now(),
  gender: "Male",
  profilePic: "prisonMike.png",
});

db.users.insertOne({
  username: "steven_murphy",
  email: "steve.murphy@ontariotechu.net",
  hashedPassword: hex_md5("steve"),
  birthday: Date.now(),
  gender: "Male",
  profilePic: "stevenmurphy.png",
});

// insert posts
db.posts.insertOne({
  username: "spencerspencerdenford",
  time: Date.now(),
  postText: "enjoying my vacation",
  imageURL: "1.jpeg",
  likes: [],
  comments: [],
});

db.posts.insertOne({
  username: "prison_mike",
  time: Date.now(),
  postText: "The worst part about prison by far.",
  imageURL: "dementor.jpg",
  likes: ["spencerspencerdenford"],
  comments: [{ username: "spencerspencerdenford", comment: "LOL", time: Date.now()}],
});

db.posts.insertOne({
  username: "steven_murphy",
  time: Date.now(),
  postText: "UOIT",
  imageURL: "UOIT.jpg",
  likes: ["spencerspencerdenford", "prison_mike"],
  comments: [{ username: "prison_mike", comment: "good post!", time: Date.now() }],
});