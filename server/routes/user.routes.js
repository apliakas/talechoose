const { Router } = require('express');
const mongoose = require('mongoose');

const User = require('../models/User.model');

const router = new Router();

const throwError = (response) => (error) => {
  response.status(500).json(error);
};

router.get('/user/:id/favourite-books', (request, response) => {
  const { id } = request.params;

  User.findById(id)
    .populate({
      path: 'favouriteBooks',
      populate: {
        path:'owner'
      }
    })
    .then((user) => {
      response.status(201).json(user);
    })
    .catch(throwError(response));
});

router.post('/user/:id/update', (request, response) => {
  const { id } = request.params;
  const updatedUser = request.body;

  User
    .findByIdAndUpdate(id, updatedUser)
    .then((result) => {
      response.status(201).json(result);
    })
    .catch(throwError(response));
});

module.exports = router;