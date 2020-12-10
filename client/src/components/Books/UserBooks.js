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

  return (
    <div className='mt-6'>
      {userBooks.map((book) => (
        <div className='box has-text-centered' key={book._id}>
          <Link to={`/book/read/${book._id}`}>
          <h1 className='is-size-3'>{book.title}</h1>
          </Link>
          { props.user && book.owner === props.user._id && (
        <button className='button is-danger is-light' onClick={() => deleteBook(book._id)}>
          Delete book
        </button>
      ) }
        </div>
      ))}
    </div>
  );
};

export default UserBooks;