# Authentication-Security-Nodejs
Security Levels -
## Level 1: 
Basic redirection based on email ID and password.
## Level 2: 
Using mongoose-encryption for encryption (negative - if anyOne gets the access of app.js then he/she will able to read the secret key and then our level of security broke.)
### Code - 
```javascript
const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = 'ThisIsSecretKey';
userSchema.plugin(encrypt, {
  secret: secret,
  encryptedFields: ['password']
});
```

Using dotenv.
### Steps-
1. Using NPM dotenv.
2. Create .env file, and add secret keys there.
3. add this at top of app.js file- 
  require('dotenv').config();
4. accessing using process.env -

#### Code-
```javascript
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ['password']
});
```
 5. always add .env in .gitignore.

## Level 3: 
Using md5 hashing.(negative- hasing attack).

### Steps -
```javascript
const md5 = require('md5');

const password = md5(req.body.password);
```

## Level 4:
Using bcrypt.
### Steps -
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;
```

Register -
```javascript
bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
// code here
})

Login - 
bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
// code here
})
```
