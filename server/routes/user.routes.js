const { Router } = require('express');
const mongoose = require('mongoose');

const User = require('../models/User.model');

const router = new Router();

const throwError = (response) => (error) => {
  response.status(500).json(error);
};

router.post('/user/:id/update', (request, response) => {
  const { id } = userId
  const updatedUser = request.body

  User.findByIdAndUpdate(userId, updatedUser)
    .then((result) => {
      response.status(201).json(result);
    })
    .catch(throwError(response));
});

module.exports = router;