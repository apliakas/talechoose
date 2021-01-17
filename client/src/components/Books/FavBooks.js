import React, { useState } from 'react';
import { Link } from "react-router-dom";

import Books from '../../services/books.service';

const FavBooks = (props) => {
  const [favouriteBooks, setFavouriteBooks] = useState([])

  return (
    <div className='mt-6'>
      <h1 className='has-text-centered mb-3 is-size-4'>This is the list of your favourite books:</h1>
      {favouriteBooks.map((book) => (
        <div className='column is-12-mobile is-6' key={book._id}>
          <div className='border-gray box has-text-centered p-0'>
            <Link to={`/book/read/${book._id}`} class="is-block p-4">
              <h1 className='is-size-3 mb-2'>{book.title}</h1>
              <div className="has-text-dark">
                <strong>Added by:</strong> {book.owner.username}
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavBooks;