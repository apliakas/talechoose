import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookDetails = (props) => {
  const [details, setDetails] = useState({});

  const getBookDetails = () => {
    const { id } = props.match.params;

    axios 
      .get(`http://localhost:5000/book/${id}`, {
        withCredentials: true,
      })
      .then((bookDetails) => {
        console.log(bookDetails);
        setDetails(bookDetails.data);
      })
      .catch((err) => console.log(err));
  }

  useEffect(getBookDetails, [props.match.params])

  const deleteBook = () => {
    const { id } = props.match.params;

    axios 
      .delete(`http://localhost:5000/book/${id}`, {
        withCredentials: true,
      })
      .then((results) => {
        props.history.push('/books');
      })
      .catch((err) => console.log(err));
  }

  const ownershipCheck = (project) => {
    if ( props.loggedInUser && project.owner === props.loggedInUser._id) {
      return(
        <div>
          <button onClick={() => deleteBook(details._id)}>
            Delete book
          </button>
        </div>
      )
    }
  };

  return (
    <div>
      <h1>Start reading here!</h1>
      <p>{details.bookName}</p>
      {ownershipCheck(details)}
    </div>
  );
};

export default BookDetails;