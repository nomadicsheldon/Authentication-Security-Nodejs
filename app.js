//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// Level 5 ==>
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// <==

// ############################## setting up frameworks ##############################
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Level 5 ==>
app.use(session({
  secret: 'MyScretFileHere.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// <==

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

// Level 5 ==>
mongoose.set('useCreateIndex', true);
// <==

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Level 5 ==>
userSchema.plugin(passportLocalMongoose);
// <==

const User = mongoose.model('User', userSchema);

// Level 5 ==>
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// <==

// ############################## Home route ##############################
app.get('/', function(req, res) {
  res.render('home');
});

// ############################## Login route ##############################
app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  // Level 5 ==>
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (!err) {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/secrets');
      });
    } else {
      console.log(err);
    }
  });
// <==
});

// ############################## Register route ##############################
app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
// Level 5 ==>
  User.register({username: req.body.username}, req.body.password, function(err, user) {
    if (!err) {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/secrets');
      });
    } else {
      console.log(err);
      res.redirect('/register');
    }
  });
// <==
});

// ############################## Secret route ##############################
// Level 5 ==>
app.get('/secrets', function(req, res) {
  if (req.isAuthenticated()){
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
});

// ############################## Logout route ##############################
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect("/");
});
// <==

// ############################## port setting ##############################
app.listen(3000, function() {
  console.log("Listening for Secret App started on port 3000");
});
