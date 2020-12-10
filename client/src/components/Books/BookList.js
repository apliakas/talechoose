import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import Books from '../../services/books.service';

const BookList = (props) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);

  const getBooks = () => {
    Books.getAll()
      .then((books) => {
        setBooks(books);
        setFilteredBooks(books);
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (event) => {
    const searchBooks = books.filter((item) => item.title.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredBooks(searchBooks);
  };

  useEffect(getBooks, []);

  return (
    <div className='mt-6'>
      {props.user ? <p className='has-text-centered mb-3 is-size-4'>Welcome {props.user.username}, this is the list of all the books for the moment.</p> : <p className='has-text-centered mb-3 is-size-4'>This is the public list of books for the moment</p>}
      <input className='input my-5' placeholder='Search here for a title' onChange={handleSearch}></input>
      {filteredBooks.map((book) => (
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