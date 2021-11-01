import React, { useEffect, useState } from 'react';

import Books from '../../services/books.service';
import User from '../../services/user.service';

import './BookDetails.scss';

const BookDetails = (props) => {
  const [book, setBook] = useState({});
  const [bookInFavBooks, setIsBookInFavBooks] = useState(true);

  const getBook = () => {
    const { id } = props.match.params;

    // `Books.getById(<id>)` will only retrieve the book details and the first block, `getBlock`
    // is used to load more blocks
    Books 
      .getById(id)
      .then((bookDetails) => {
        setBook(bookDetails);
      })
      .catch((err) => console.log(err));
  };

  /**
   * Retrieves a block from the book and adds it to its array of blocks (`book.blocks`)
   * @param {string} title - Title of the block to load (`decision.toBlock`)
   */
  const getBlock = (title) => {
    const { id } = props.match.params;

    Books
      .getBlockByTitle(id, title)
      .then((block) => {
        const blocks = [...book.blocks, block]
        setBook({...book, blocks});
      })
  };

  const addFavourites = () => {
    const user = props.user;
    const updatedUser = { ...user, favouriteBooks: user.favouriteBooks.concat([book._id])}
    
    User.update(user._id, updatedUser)
      .then(() => console.log('The book has been added to your favourites'))
      .catch((err) => console.log(err));

    props.setUser(updatedUser);
  };

  const removeFavourites = () => {
    const user = props.user;
    const updatedUser = { ...user, favouriteBooks: user.favouriteBooks.filter((favBook) => favBook !== book._id)}
    
    User.update(user._id, updatedUser)
      .then(() => console.log('The book has been deleted from your favourites'))
      .catch((err) => console.log(err));

    props.setUser(updatedUser);
  };

  useEffect(getBook, []);

  useEffect(() => {
    if (props.user?.favouriteBooks && book) {
      setIsBookInFavBooks(props.user.favouriteBooks.includes(book._id));
    }
  }, [props.user, book]);

  return (
    <div className="book-container">
      <h3 className='has-text-centered is-size-1'>{book.title}</h3>
      { props.user && (bookInFavBooks ? <div className='buttons is-right'><button className='button is-small is-warning is-light' onClick={removeFavourites} >Delete book from favourites</button></div> : <div className='buttons is-right'><button className='button is-small is-warning is-light' onClick={addFavourites} >Add book to favourites </button></div>)} 
      {book.information && Object.entries(book.information).length && (
        <details  className='help mb-4' open>
          <summary className='pl-2 is-size-6 mb-2'>About this book</summary>
          {Object.entries(book.information).map(([key, value]) => (
            <div className='px-4' key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </details>
      )}
      {book.blocks?.map((block, index) => (
        index === book.blocks.length -1 ?
        (
          <div className='has-text-centered block' key={`${block._id}-${index}`}>
            <p className='has-text-justified my-5' dangerouslySetInnerHTML={{__html: block.content}}></p>
            {!block.decisions?.length && (<h3>The End</h3>)}
            {(book.blocks.length === index + 1) && block.decisions?.map((decision) => (
              <button className='button is-info m-3 is-multiline' key={`${decision._id}-${index}`} type='button' onClick={() => getBlock(decision.toBlock)}>{decision.option}</button>
            ))}
          </div>
        )
        :
        (
          <details className="my-2 has-background-info-light"> 
            <summary className='pl-2'>{block.title}</summary>
            <p className='has-text-justified px-4 pb-4 pt-2' dangerouslySetInnerHTML={{__html: block.content}}></p>
          </details>
        )
      ))}
      {book.appendix && Object.entries(book.appendix).length && (
        <details className='help my-6'>
          <summary className='pl-2 is-size-6' >Appendix</summary>
          {Object.entries(book.appendix).map(([key, value]) => (
            <div className='my-2 has-text-justified px-4' key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </details>
      )}
    </div>
  );
};

export default BookDetails;
