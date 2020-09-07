//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

// Level 6 ==>
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
// <==
// ############################## setting up frameworks ##############################
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.use(session({
  secret: 'MyScretFileHere.',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Level 6 ==>
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({
      googleId: profile.id
    }, function(err, user) {
      return cb(err, user);
    });
  }
));
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

mongoose.set('useCreateIndex', true);
// Level 6 ==>
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  secret: String
});
// <==
userSchema.plugin(passportLocalMongoose);
// Level 6 ==>
userSchema.plugin(findOrCreate);
// <==

const User = mongoose.model('User', userSchema);

passport.use(User.createStrategy());
// Level 6 ==>
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
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
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err) {
    if (!err) {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/secrets');
      });
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
  // Level 5 ==>
  User.register({
    username: req.body.username
  }, req.body.password, function(err, user) {
    if (!err) {
      passport.authenticate('local')(req, res, function() {
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
app.get('/secrets', function(req, res) {
  User.find({'secret':{$ne: null}}, function(err, foundUsers){
    if (!err) {
      if (foundUsers) {
        res.render('secrets', {usersWithSecrets: foundUsers});
      }
    } else {
      console.log(err);
    }
  });
});

// ############################## Logout route ##############################
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect("/");
});

// ############################## auth google route ##############################
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile']
  }));

app.get('/auth/google/secrets',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

// ############################## submit route ##############################
app.get('/submit', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect('/login');
  }
});


app.post('/submit', function(req, res) {
  const submittedSecret = req.body.secret;
  User.findById(req.user.id, function(err, foundUser) {
    if (!err) {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect('/secrets');
        });
      }
    } else {
      console.log(err);
    }
  });
});
// ############################## port setting ##############################
app.listen(3000, function() {
  console.log("Listening for Secret App started on port 3000");
});
