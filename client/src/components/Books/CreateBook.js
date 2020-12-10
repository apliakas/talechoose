import React, { useState } from 'react';

import Books from '../../services/books.service';

import './CreateBook.css';

const newDecision = () => ({
  id: +new Date(),
  option: 'Continue',
  toBlock: '',
});

const newBlock = (index) => ({
  id: +new Date(),
  title: `Block ${index}`,
  content: '',
});

const initialState = {
  title: '',
  blocks: [newBlock(1)],
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
    const blocks = [...bookDetails.blocks, newBlock(bookDetails.blocks.length + 1)];

    setBookDetails({ ...bookDetails, blocks });
  };

  const removeBlock = (block) => { 
    const blocks = bookDetails.blocks.filter((item) => item.id !== block.id);

    setBookDetails({ ...bookDetails, blocks });
  }

  const addDecision = (block) => {
    const { blocks } = bookDetails;

    const decisions = [...(block.decisions || []), newDecision()];

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

  const removeLastDecision = (block, id) => {
    const { blocks } = bookDetails;

    const decisions = block.decisions.filter((decision) => decision.id !== id);

    const blockIndex = blocks.indexOf(block);
    const totalBlocks = blocks.length;

    const modifiedBlock = { ...block, decisions };
    
    const modifiedBlocks = [
      ...blocks.slice(0, blockIndex),
      modifiedBlock,
      ...blocks.slice(blockIndex + 1, totalBlocks),
    ];

    setBookDetails({ ...bookDetails, blocks: modifiedBlocks });
  }

  return (
    <div>
      <h1 className='is-size-3 has-text-centered mt-6'>Your adventure starts here...</h1>
      <div className='columns is-centered mt-3'>
        <form className='column is-three-fifths' onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor='title'>Title of your book:</label>
            <div className='control'>
              <input
                className='input'
                placeholder='Book title '
                id='title'
                name='title'
                value={bookDetails.title}
                onChange={handleBookChange}
                required
              />
            </div>
            
          </div>
          {bookDetails.blocks.map((block, index) => (
            <div className='has-background-light p-2 my-4' key={block.id}>
              <div className='is-flex is-justify-content-space-between'>
                <label htmlFor={block.id}>Title of your block:</label>
                {bookDetails.blocks.length > 1 ? <button  className='button is-small is-danger is-light ' onClick={() => removeBlock(block)}>Delete block</button> : <></>}
              </div>
              
              <div className='control mb-2'>
                <input
                  className='input'
                  id={block.id}
                  name='title'
                  value={block.title}
                  onChange={handleBlockChange(block)}
                  required
                />
              </div>
              <label htmlFor='blockContent'>Content of your block:</label>
              
              <textarea
                className='textarea mb-2'
                id='blockContent'
                rows="4"
                cols="50"
                name='content'
                value={block.content}
                onChange={handleBlockChange(block)}
                required
              />
              {block.decisions?.map((decision) => (
                <div className='is-flex is-justify-content-space-between py-1' key={decision.id}>
                  <div>
                    <label className='pr-1'>Option:</label>
                    <input className='input is-inline is-small' name='option' onChange={handleDecisionChange(block, decision)} value={decision.option} required></input>
                  </div>
                  <div>
                    <label className='pr-1'>Title of the block where it leads:</label>
                    <select className='is-small select is-inline' name='toBlock' onChange={handleDecisionChange(block, decision)} required defaultValue={''}>
                      <option disabled value={''}>Select a block </option>
                      {bookDetails.blocks.map((item) => (
                        <option key={item.id} value={item.title}>{item.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button className='button is-small is-danger is-light' type="button" onClick={() => removeLastDecision(block, decision.id)}>Detele decision</button>
                </div>
              ))}
              <button className='button is-small is-success is-light block mb-2' type="button" onClick={() => addDecision(block)}>Add a decision</button>
            </div>
          ))}
          <button className='button is-normal is-success is-light' type="button" onClick={addBlock}>Add new block</button>
          <div className='is-flex is-justify-content-center my-5'>
            <button className='button is-normal is-info' type='submit'>Submit your story</button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default CreateBook;