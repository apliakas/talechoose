const { Router } = require('express');
const mongoose = require('mongoose');

const Book = require('../models/Book.model');

const router = new Router();

const throwError = (response) => (error) => {
  response.status(500).json(error);
};

router.get('/books', (request, response) => {
  Book.find().populate('owner')
    .then((books) => { 
      const publicBooks = books.filter(book => book.public === true)
      response.status(200).json(publicBooks);
    })
    .catch(throwError(response));
});

router.get('/book/:id', (request, response) => {
  const { id } = request.params;
  const { allBlocks } = request.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    response.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Book.findById(id)
    .then((book) => {
      if (!allBlocks) {
        book.blocks = [book.blocks[0]];
      }

      response.status(200).json(book);
    })
    .catch(throwError(response));
});

router.get('/book/:bookId/:blockTitle', (request, response) => {
  const { bookId, blockTitle } = request.params;

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    response.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  if (!blockTitle) {
    response.status(400).json({ message: "Specified title is not valid" });
    return;
  }

  Book.findById(bookId)
    .then((book) => {
      const block = book.blocks.find((block) => block.title === blockTitle);

      response.status(200).json(block); 
    })
    .catch(throwError(response));
});

router.get('/books/user/:userId', (request, response) => {
  const { userId } = request.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    response.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Book.find()
    .then((books) => { 
      const userBooks = books.filter((book) => book.owner == userId);
      
      response.status(200).json(userBooks);
    })
    .catch(throwError(response));
})

router.post('/book', (request, response) => {
  const book = request.body;

  book.blocks = book.blocks.map((block) => {
    return {...block, content: block.content.replace('\n', '<br/>')};
  });

  Book
    .create({
      ...request.body,
      owner: request.user._id,
    })
    .then((result) => {
      response.status(201).json(result);
    })
    .catch(throwError(response));
});

router.post('/book/:id', (request, response) => {
  const { id } = request.params;
  const updatedBook = request.body;
  
  Book
    .findByIdAndUpdate(id, updatedBook)
    .then((result) => {
      response.status(201).json(result);
    })
    .catch(throwError(response));
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
    .catch(throwError(response));
});

module.exports = router;