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

  const getBlock = (title) => {
    const { id } = props.match.params;

    Books
      .getBlockByTitle(id, title)
      .then((block) => {
        const blocks = [...book.blocks, block]
        setBook({...book, blocks})
      })
  }

  useEffect(getBook, [props.match.params]);

  return (
    <div>
      <h1>Start reading here!</h1>
      <h3>{book.title}</h3>
      {book.information && Object.entries(book.information).length && (
        <details open>
          <summary>Information</summary>
          {Object.entries(book.information).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </details>
      )}
      {book.blocks?.map((block, index) => (
        index === book.blocks.length -1 ?
        (
          <div key={`${block._id}-${index}`}>
            <p dangerouslySetInnerHTML={{__html: block.content}}></p>
            {!block.decisions?.length && (<h3>The End</h3>)}
            {(book.blocks.length === index + 1) && block.decisions?.map((decision) => (
              <div key={`${decision._id}-${index}`}>
                <button type='button' onClick={() => getBlock(decision.toBlock)}>{decision.option}</button>
              </div>
            ))}
          </div>
        )
        :
        (
          <details>
            <summary>{block.title}</summary>
            <p>{block.content}</p>
          </details>
        )
      ))}
      {book.appendix && Object.entries(book.appendix).length && (
        <details>
          <summary>Appendix</summary>
          {Object.entries(book.appendix).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </details>
      )}
    </div>
  );
};

export default BookDetails;