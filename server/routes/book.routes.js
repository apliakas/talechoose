const {Router, response, request} = require('express');
const mongoose = require('mongoose');
const router = new Router();

const Book = require('../models/book.model')

router.post('/book', (request, response) => {
  const { bookName, bookContent, bookPath1, bookPath2} = request.body;

  Book.create({
    bookName, 
    bookContent, 
    bookPath1,
    bookPath2,
    owner: request.user._id,
  })
  .then((res) => {response.status(201).json(res)})
  .catch((err) => {response.status(500).json(err)})
});

router.get('/books', (request, response) => {
  Book.find()
    .then((books) => { 
      response.status(200).json(books)
    })
    .catch((err) => {
      response.status(500).json(err)
    });
});

router.get('/book/:id', (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).json({ message: "Specified id is not valid" });
    return
  };

  Book.findById(id)
    .then((book) => {
      response.status(200).json(book); 
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});

router.delete('/book/:id', (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).json({ message: "Specified id is not valid" });
    return
  };

  Book.findByIdAndRemove(id)
    .then(() => {
      response.status(200).json({message: 'The book has been deleted'}); 
    })
    .catch((err) => {
      response.status(500).json(err);
    });
});



module.exports = router;