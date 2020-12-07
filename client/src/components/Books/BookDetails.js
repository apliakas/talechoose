import React, { useEffect, useState } from 'react';

import Books from '../../services/books.service';

const BookDetails = (props) => {
  const [book, setBook] = useState({});

  const getBook = () => {
    const { id } = props.match.params;

    Books 
      .getById(id)
      .then((bookDetails) => {
        setBook(bookDetails);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getBook, [props.match.params]);

  const deleteBook = (id) => {
    Books 
      .deleteById(id)
      .then(() => {
        props.history.push('/books');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h1>Start reading here!</h1>
      <p>{book.title}</p>
      {book.blocks?.map((block) => (
        <div>
          <p>{block.content}</p>
        </div>
      ))}
      { props.user && book.owner === props.user._id && (
        <button onClick={() => deleteBook(book._id)}>
          Delete book
        </button>
      ) }
    </div>
  );
};

export default BookDetails;