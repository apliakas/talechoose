import React, { useState } from 'react';
import axios from 'axios';

const initialState = {
  bookName: '',
  bookContent: '',
  bookPath1: 0,
  bookPath2: 0,
}

const AddBookForm = (props) => {
  const [bookForm, setBookState] = useState(initialState)

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookState({ ...bookForm, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { bookName, bookContent, bookPath1, bookPath2 } = bookForm;

    axios
      .post('http://localhost:5000/book',
       { bookName, bookContent, bookPath1, bookPath2 }, 
       { withCredentials: true,})
      .then(() => { 
        setBookState(initialState) 
        props.history.push('/books')})
      .catch((error) => console.log(error));
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor='bookName'>Name of your book:</label>
        <input id='bookName' type='text' name='bookName' value={bookForm.bookName} onChange={handleInputChange}></input>

        <label htmlFor='bookContent'>Write a chapter</label>
        <textarea id='bookContent' type='text' rows="4" cols="50" name='bookContent' value={bookForm.bookContent} onChange={handleInputChange}></textarea>

        <div className='pathInputs'>
        <label htmlFor='path1'>Path 1:</label>
        <input id='path1' type='number' name='bookPath1' value={bookForm.bookPath1} onChange={handleInputChange}></input>

        <label htmlFor='path2'>Path 2:</label>
        <input id='path2' type='number' name='bookPath2' value={bookForm.bookPath2} onChange={handleInputChange}></input>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default AddBookForm;