const bcrypt = require('bcrypt');
const {Router} = require('express');
const User = require('../models/User.model');
const passport = require('passport');
const router = new Router();

router.post('/signup', (request, response) => {
  const { username, password } = request.body;
  
  if (!username || !password) {
    response.status(400).json({ message: 'All fields are mandatory, please provide username and password.'})  
    return;
  };

  if (password.length < 7) {
    response.status(400).json({
      message: 'Please make your password at least 8 characters long.'
    })
    return;
  }

  User.findOne({username}, (err, foundUser) => {
    if (err) {
      response.status(500).json({ message: 'Username check went bad'});
      return;
    };

    if (foundUser) {
      response.status(400).json({ message: 'Username taken. Choose another one.'});
      return;
    };

    const salt = bcrypt.genSaltSync(10);

    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
      username: username,
      password: hashPass,
    })

    aNewUser.save((err) => {
      if (err) {
        response.status(400).json({ message: 'Saving user to database went wrong'});
        return;
      }

      request.login(aNewUser, (err) => {
        if (err) {
          response.status(500).json({ message: 'Login after signup went bad.'});
          return;
        }
        response.status(200).json(aNewUser);
      });
    });
  });
});

router.post('/login', (request, response, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      response 
        .status(500).json({ message: 'Something went wrong authenticating the User.'});
        return;
    }

    if (!theUser) {
      response.status(401).json(failureDetails);
      return;
    }

    request.login(theUser, (err) => {
      if (err) {
        response.status(500).json({ message: 'Session save went bad.'});
        return;
      }

      response.status(200).json(theUser)
    })
  }) (request, response, next);
})

router.post('/logout', (request, response) => {
  request.logout();
  response.status(200).json({ message: 'Log out success'});
});

router.get('/loggedin', (request, response) => {
  if (request.isAuthenticated()) {
    response.status(200).json(request.user);
    return;
  }
  response.status(403).json({ message: 'Unauthorized'});
});

module.exports = router;