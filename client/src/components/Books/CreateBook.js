import React, { useState } from 'react';

import Books from '../../services/books.service';

const newBlock = () => ({ id: +new Date() });

const initialState = {
  title: '',
  blocks: [newBlock()],
};

const CreateBook = (props) => {
  const [bookDetails, setBookDetails] = useState(initialState);

  const handleBookChange = (event) => {
    const { name, value } = event.target;

    setBookDetails({ ...bookDetails, [name]: value });
  };

  const handleBlockChange = (block) => (event) => {
    const { name, value } = event.target;

    const { blocks } = bookDetails;
    const index = blocks.indexOf(block);
    const total = blocks.length;

    const modifiedBlock = { ...block, [name]: value };

    const modifiedBlocks = [
      ...blocks.slice(0, index),
      modifiedBlock,
      ...blocks.slice(index + 1, total),
    ];
    
    setBookDetails({ ...bookDetails, blocks: modifiedBlocks });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    Books.create(bookDetails)
      .then((book) => { 
        setBookDetails(initialState);

        props.history.push(`/book/${book._id}`);
      })
      .catch((error) => console.log(error));
  };

  const addBlock = () => {
    const blocks = [...bookDetails.blocks, newBlock()];

    setBookDetails({ ...bookDetails, blocks });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor='title'>Title of your book:</label>
          <input
            id='title'
            name='title'
            value={bookDetails.title}
            onChange={handleBookChange}
          />
        </div>
        <br/>
        <br/>
        {bookDetails.blocks.map((block) => (
          <div key={block.id}>
            <label htmlFor='blockTitle'>Title of your block:</label>
            <input
              id='blockTitle'
              name='title'
              value={block.title}
              onChange={handleBlockChange(block)}
            />
            <br/>
            <label htmlFor='blockContent'>Content of your block:</label>
            <textarea
              id='blockContent'
              rows="4"
              cols="50"
              name='content'
              value={block.content}
              onChange={handleBlockChange(block)}
            />
          </div>
        ))}
        <button onClick={addBlock}>Add new block</button>
        <br/>
        <br/>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default CreateBook;