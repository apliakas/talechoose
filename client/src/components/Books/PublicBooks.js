import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import Books from '../../services/books.service';

const PublicBooks = (props) => {
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
      {props.user ? <p className='has-text-centered mb-3 is-size-4'>Welcome {props.user.username}, this is the list of all the public books for the moment.</p> : <p className='has-text-centered mb-3 is-size-4'>This is the public list of books for the moment</p>}
      <input className='input mt-4' placeholder='Search here for a title' onChange={handleSearch}></input>
      <div className='mt-6 columns is-flex is-flex-wrap-wrap'>
        {filteredBooks.map((book) => (
          <div className='column is-12-mobile is-6' key={book._id}>
            <div className='border-gray box has-text-centered p-0'>
              <Link to={`/book/read/${book._id}`} class="is-block p-4">
                <h1 className='is-size-3 mb-2'>{book.title}</h1>
                <div className="has-text-dark">
                  <strong>Added by:</strong> {book.owner.username}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicBooks;