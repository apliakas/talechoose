import React, { useEffect, useState } from 'react';

import Books from '../../services/books.service';

const EditBook = (props) => {
  const [book, setBook] = useState({});

  const getBook = () => {
    const { id } = props.match.params;

    Books 
      .getById(id, true)
      .then((bookDetails) => {
        setBook(bookDetails);
        console.log(bookDetails);
      })
      .catch((err) => console.log(err));
  };

  useEffect(getBook, [props.match.params]);

  return (
    <div>
      <h1 className='title is-2 has-text-centered'>You are editing the book {book.title}.</h1>
      
      
    </div>
  );
};

export default EditBook;