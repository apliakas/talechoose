import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import Books from '../../services/books.service';
import User from '../../services/user.service';

//This component includes the code for the pages Favourite Books, User Books and Public Books.
const BooksList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);

  //
  const getBooks = () => {
    const userId = props.user?._id;
    
    let promise;
    if (props.favBooks) {
      promise = User.getFavouriteBooks(userId);
    } else if (props.userBooks) {
      promise = Books.getByUser(userId);
    } else {
      promise = Books.getAll()
    }

    promise
      .then((books) => {
        setBooks(books);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getBooks, [props.match.params]);

  const deleteBook = (id) => {
    Books 
      .deleteById(id)
      .then(() => {
        const remainderBooks = books.filter((book) => book._id !== id);
        setBooks(remainderBooks);
      })
      .catch((err) => console.log(err));
  };

  const confirmDeleteBook = (book) => {
    if (window.confirm(`Are you sure you want to delete the book ${book.title}?`)) {
      deleteBook(book._id)
    } else {
      console.log('something')
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  return (
    <div className='mt-6'>
      <p className='has-text-centered mb-3 is-size-4'>
        {props.publicBooks && (props.user ? `Welcome ${props.user.username}, this` : 'This') + ' is the list of all the public books for the moment'}
        {props.favBooks && 'This is the list of your favourite books:'}
        {props.userBooks && 'Your books'}
      </p>
      {props.publicBooks && <input className='input mt-4' placeholder='Search here for a title' onChange={handleSearch}/>}

      <div className='mt-6 columns is-flex is-flex-wrap-wrap'>

        {books.filter((item) => item.title.toLowerCase().includes(searchTerm)).map((book) => (
          <div className='column is-12-mobile has-text-centered is-6' key={book._id}>
            <div className='border-gray box has-text-centered p-0 mb-2'>
              <Link to={`/book/read/${book._id}`} class="is-block p-4">
                <h1 className='is-size-3 mb-2'>{book.title} {props.userBooks && (book.public ? '🔓' : '🔒')}</h1>
                {!props.userBooks && <div className="has-text-dark">
                  <strong>Added by:</strong> {book.owner.username}
                </div>}
              </Link>
            </div>

            {props.userBooks && (props.user && book.owner === props.user._id && (
            <div>
              <button className='button is-danger is-light ml-3' onClick={() => confirmDeleteBook(book)}>
                Delete book
              </button>
              <Link className='button is-success is-light ml-3' to={`/book/editBook/${book._id}`}>Edit Book</Link>
            </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksList;