import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import Books from '../../services/books.service';

const BookList = () => {
  const [books, setBooks] = useState([]);

  const getBooks = () => {
    Books.getAll()
      .then((books) => {
        setBooks(books);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getBooks, []);

  return (
    <div>
      {books.map((book) => (
        <div key={book._id}>
          <Link to={`/book/read/${book._id}`}>
            <h1>{book.title}</h1>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BookList;