//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// ############################## setting up frameworks ##############################
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//######################## mongoose setup with dbName ########################
// connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = 'userDB';

// mongoose.connect("mongodb://localhost:27017/fruitsDB");
mongoose.connect(url + "/" + dbName, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const userSchema = {
  email: String,
  password: String
};

const User = mongoose.model('User', userSchema);

// ############################## Home route ##############################
app.get('/', function(req, res) {
  res.render('home');
});

// ############################## Login route ##############################
app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({email: userName}, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets');
        } else {
          res.redirect('/');
        }
      }
    } else {
      console.log(err);
    }
  });

});

// ############################## Register route ##############################
app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (!err) {
      res.render('secrets');
    } else {
      console.log(err);
    }
  });

});

// ############################## port setting ##############################
app.listen(3000, function() {
  console.log("Listening for Secret App started on port 3000");
});
