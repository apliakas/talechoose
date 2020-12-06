import React, { useState } from 'react';

import Books from '../../services/books.service';

const initialState = {
  bookName: '',
  bookContent: '',
  bookPath1: 0,
  bookPath2: 0,
}

const CreateBook = (props) => {
  const [bookDetails, setBookDetails] = useState(initialState)

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setBookDetails({ ...bookDetails, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    Books.create(bookDetails)
      .then(() => { 
        setBookDetails(initialState);

        props.history.push('/books');
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor='bookName'>Name of your book:</label>
        <input
          id='bookName'
          type='text'
          name='bookName'
          value={bookDetails.name}
          onChange={handleInputChange}
        />

        <label htmlFor='bookContent'>Write a chapter</label>
        <textarea
          id='bookContent'
          type='text'
          rows="4"
          cols="50"
          name='bookContent'
          value={bookDetails.content}
          onChange={handleInputChange}
        />

        <div className='pathInputs'>
          <label htmlFor='path1'>Path 1:</label>
          <input
            id='path1'
            type='number'
            name='bookPath1'
            value={bookDetails.path1}
            onChange={handleInputChange}
          />

          <label htmlFor='path2'>Path 2:</label>
          <input
            id='path2'
            type='number'
            name='bookPath2'
            value={bookDetails.path2}
            onChange={handleInputChange}
          />
        </div>

        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default CreateBook;