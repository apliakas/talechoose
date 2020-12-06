const {Router, response, request} = require('express');
const mongoose = require('mongoose');

const Book = require('../models/Book.model')

const router = new Router();

const throwError = (err) => {
  response.status(500).json(err);
};

router.get('/books', (request, response) => {
  Book.find()
    .then((books) => { 
      response.status(200).json(books);
    })
    .catch(throwError);
});

router.get('/book/:id', (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Book.findById(id)
    .then((book) => {
      response.status(200).json(book); 
    })
    .catch(throwError);
});

router.post('/book', (request, response) => {
  Book
    .create({
      ...request.body,
      owner: request.user._id,
    })
    .then((result) => {
      response.status(201).json(result);
    })
    .catch(throwError);
});

router.delete('/book/:id', (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Book.findByIdAndRemove(id)
    .then(() => {
      response.status(200).json({ message: 'The book has been deleted' }); 
    })
    .catch(throwError);
});

module.exports = router;