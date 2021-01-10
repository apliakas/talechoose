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

  const redirectToEditBook = (book) => {
    props.history.push(`/book/editBook/${book._id}`)
  }

  return (
    <div className='mt-6 columns is-flex is-flex-wrap-wrap'>
      {userBooks.map((book) => (
        <div className='column is-6 has-text-centered'>
        <div className='box border-gray' key={book._id}>
          <Link to={`/book/read/${book._id}`}>
          <h1 className='is-size-3'>{book.title}</h1>
          </Link>
          </div>
          { props.user && book.owner === props.user._id && (
            <div>
              <button className='button is-danger is-light ml-3' onClick={() => deleteBook(book._id)}>
                Delete book
              </button>
              <button className='button is-success is-light ml-3' onClick={() => redirectToEditBook(book)} >
                Edit Book
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserBooks;