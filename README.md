# Authentication-Security-Nodejs
Security Levels -
Level 1: Basic redirection based on email ID and password.
Level 2: Using mongoose-encryption for encryption (negative - if anyOne gets the access of app.js then he/she will able to read the secret key and then our level of security broke.)
Code - 
const encrypt = require('mongoose-encryption');

