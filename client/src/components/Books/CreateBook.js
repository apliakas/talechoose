import React, { useState } from 'react';

import Books from '../../services/books.service';

const newDecision = () => ({
  id: +new Date(),
  option: '',
  toBlock: '',
});

const newBlock = () => ({
  id: +new Date(),
  title: '',
  content: '',
  decisions: [],
});

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

  const handleDecisionChange = (block, decision) => (event) => {
    const { name, value } = event.target;

    const { blocks } = bookDetails;

    const decisionIndex = block.decisions.indexOf(decision);
    const totalDecisions = block.decisions.length;

    const modifiedDecision = { ...decision, [name]: value };

    const modifiedDecisions = [
      ...block.decisions.slice(0, decisionIndex),
      modifiedDecision,
      ...block.decisions.slice(decisionIndex + 1, totalDecisions),
    ];

    const blockIndex = blocks.indexOf(block);
    const totalBlocks = blocks.length;
    
    const modifiedBlock = { ...block, decisions: modifiedDecisions };
    
    const modifiedBlocks = [
      ...blocks.slice(0, blockIndex),
      modifiedBlock,
      ...blocks.slice(blockIndex + 1, totalBlocks),
    ];
    
    setBookDetails({ ...bookDetails, blocks: modifiedBlocks });
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();

    
    Books.create(bookDetails)
      .then((book) => { 
        setBookDetails(initialState);

        props.history.push(`/book/read/${book._id}`);
      })
      .catch((error) => console.log(error));
  };

  const addBlock = () => {
    const blocks = [...bookDetails.blocks, newBlock()];

    setBookDetails({ ...bookDetails, blocks });
  };

  const addDecision = (block) => {
    const { blocks } = bookDetails;

    const decisions = [...block.decisions, newDecision()];

    const blockIndex = blocks.indexOf(block);
    const totalBlocks = blocks.length;

    const modifiedBlock = { ...block, decisions };
    
    const modifiedBlocks = [
      ...blocks.slice(0, blockIndex),
      modifiedBlock,
      ...blocks.slice(blockIndex + 1, totalBlocks),
    ];

    setBookDetails({ ...bookDetails, blocks: modifiedBlocks });
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
            <label htmlFor={block.id}>Title of your block:</label>
            <input
              id={block.id}
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
            <br/>
            {block.decisions.map((decision) => (
              <div key={decision.id}>
                <label>Option:</label>
                <input name='option' onChange={handleDecisionChange(block, decision)}></input>

                <label>Title of the block where it leads:</label>
                <input name='toBlock' onChange={handleDecisionChange(block, decision)}></input>
              </div>
            ))}
            <button type="button" onClick={() => addDecision(block)}>Add a decision</button>
          </div>
        ))}
        <button type="button" onClick={addBlock}>Add new block</button>
        <br/>
        <br/>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default CreateBook;