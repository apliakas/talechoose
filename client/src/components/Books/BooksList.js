import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

import Books from '../../services/books.service';
import User from '../../services/user.service';

const BooksList = (props) => {
  const [publicBooks, setPublicBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [favouriteBooks, setFavouriteBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);

  const getBooks = () => {
    if (props.publicBooks) {
      getPublicBooks()
    } else if (props.favBooks) {
      getFavouriteBooks()
    } else if (props.userBooks) {
      getUserBooks()
    };
  };

  useEffect(getBooks, [props.match.params]);

  const renderBooks = () => {
    if(props.userBooks) {
      return userBooks
    } else if (props.favBooks) {
      return favouriteBooks
    } else {
      return filteredBooks
    }
  };

  const getUserBooks = () => {
    Books.getByUser(props.user._id)
      .then((books) => {
        setUserBooks(books);
      })
      .catch((err) => console.log(err));
  };

  const deleteBook = (id) => {
    Books 
      .deleteById(id)
      .then(() => {
        const remainderBooks = userBooks.filter((book) => book._id !== id);
        setUserBooks(remainderBooks);
      })
      .catch((err) => console.log(err));
  };

  const confirmDeleteBook = (book) => {
    if ( window.confirm(`Are you sure you want to delete the book ${book.title}?`)) {
      deleteBook(book._id)
    } else {
      console.log('something')
    };
  };

  const getPublicBooks = () => {
    Books.getAll()
      .then((books) => {
        setPublicBooks(books);
        setFilteredBooks(books);
      })
      .catch((err) => console.log(err));
  };

  const getFavouriteBooks = () => {
    const userId = props.user._id;
    
    User.getFavouriteBooks(userId)
      .then((books) => {
        setFavouriteBooks(books)})
      .catch((err) => console.log(err));
  };

  const handleSearch = (event) => {
    const searchBooks = publicBooks.filter((item) => item.title.toLowerCase().includes(event.target.value.toLowerCase()));
    setFilteredBooks(searchBooks);
  };

  return (
    <div className='mt-6'>
      { props.publicBooks && (props.user ? <p className='has-text-centered mb-3 is-size-4'>Welcome {props.user.username}, this is the list of all the public books for the moment.</p> : <p className='has-text-centered mb-3 is-size-4'>This is the public list of books for the moment</p>)}
      {props.favBooks && <p className='has-text-centered mb-3 is-size-4'>This is the list of your favourite books:</p> }
      {props.publicBooks && <input className='input mt-4' placeholder='Search here for a title' onChange={handleSearch}></input>}
      {props.userBooks && <p className='has-text-centered mb-3 is-size-4'>Your books</p>}
      <div className='mt-6 columns is-flex is-flex-wrap-wrap'>

        {renderBooks().map((book) => (
          <div className='column is-12-mobile has-text-centered is-6' key={book._id}>
            <div className='border-gray box has-text-centered p-0'>
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