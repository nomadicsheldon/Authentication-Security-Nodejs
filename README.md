# Authentication-Security-Nodejs
Security Levels -
## Level 1: 
Basic redirection based on email ID and password.
## Level 2: 
Using mongoose-encryption for encryption (negative - if anyOne gets the access of app.js then he/she will able to read the secret key and then our level of security broke.)
### Code - 
const encrypt = require('mongoose-encryption');
## 
// Level 2 Authentication ==>
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = 'ThisIsSecretKey';
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ['password']
});
// <==

Using dotenv.
Steps-
1. Using NPM dotenv.
2. Create .env file, and add secret keys there.
3. add this at top of app.js file- 
  require('dotenv').config();
4. accessing using process.env -

// Level 2 Authentication ==>
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password']
});
// <==
 5. always add .env in .gitignore.

## Level 3: 
Using md5 hashing.

Steps -
const md5 = require('md5');

const password = md5(req.body.password);

