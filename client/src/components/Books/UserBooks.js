import React, { useEffect,  useState } from 'react';
import { Link } from "react-router-dom";

import Books from '../../services/books.service';

const UserBooks = (props) => {
  const [userBooks, setUserBooks] = useState([]);

  const getUserBooks = () => {
    Books.getByUser(props.user._id)
      .then((books) => {
        setUserBooks(books);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getUserBooks, []);

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

  return (
    <div className='mt-6 columns is-flex is-flex-wrap-wrap'>

      {userBooks.map((book) => (
        <div className='column is-6 has-text-centered'>
          <div className='box border-gray mb-3' key={book._id}>
            <Link to={`/book/read/${book._id}`}>
            <h1 className='is-size-3'>{book.title} { book.public ? '🔓' : '🔒' }</h1>
            </Link>
          </div>

          { props.user && book.owner === props.user._id && (
            <div>
              <button className='button is-danger is-light ml-3' onClick={() => confirmDeleteBook(book)}>
                Delete book
              </button>
              <Link className='button is-success is-light ml-3' to={`/book/editBook/${book._id}`}>Edit Book</Link>
            </div>
          )}

        </div>
      ))}

    </div>
  );
};

export default UserBooks;  