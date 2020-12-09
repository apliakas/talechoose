import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import Books from '../../services/books.service';

const BookList = (props) => {
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
    <div className='mt-6'>
      {props.user ? <p className='has-text-centered mb-3 is-size-4'>Welcome {props.user.username}, this is the public list of books for the moment.</p> : <p className='has-text-centered mb-3 is-size-4'>This is the public list of books for the moment</p>}
      {books.map((book) => (
        <div className='box has-text-centered' key={book._id}>
          <Link to={`/book/read/${book._id}`}>
            <h1 className='is-size-3'>{book.title}</h1>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BookList;