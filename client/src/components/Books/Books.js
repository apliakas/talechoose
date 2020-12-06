import React, { useEffect, useState } from 'react';
import AddBookForm from './AddBook';
import axios from 'axios';
import { Link } from "react-router-dom"

const Books = () => {
  const [listOfBooks, setListOfBooks] = useState([]);

  const getAllBooks = () => {
    axios
      .get('http://localhost:5000/books', {
        withCredentials: true,
      })
      .then((books) => {
        console.log(books);
        setListOfBooks(books.data)
      })
      .catch((err) => console.log(err))
  }

  useEffect(getAllBooks, []);

  return (
    <div>
      {listOfBooks.map((book) => {
        return (
          <div key={book._id}>
            <Link to={`/book/${book._id}`}>
              <h1>{book.bookName}</h1>
            </Link>
            
          </div>
        );
      })}
    </div>
  );
};

export default Books;