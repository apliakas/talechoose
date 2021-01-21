import React, { useState, useEffect } from 'react';

import Books from '../../services/books.service';

import './CreateBook.scss';

let blockCounter = 1;

const newDecision = () => ({
  id: +new Date(),
  option: 'Continue',
  toBlock: '',
});

const newBlock = () => ({
  _id: `${+new Date()}`,
  title: `Block ${blockCounter}`,
  content: '',
});

const initialState = {
  title: '',
  blocks: [newBlock()],
};

const EditAndCreateBook = (props) => {
  const [bookDetails, setBookDetails] = useState(initialState);
  const [visibility, setVisibility] = useState(true);

  const { id: bookId } = props.match.params;
  const editMode = !!bookId;

  const getBookById = (id) => {
    Books 
      .getById(id, true)
      .then((bookToEdit) => {

        const fixedDecisions = {
          ...bookToEdit,
          blocks: bookToEdit.blocks.map((block) => {
            return {
              title: block.title,
              content: block.content,
              _id: block._id,
              decisions: block.decisions?.map((decision) => {
                let decisionPath = bookToEdit.blocks.find(block => block.title === decision.toBlock);

                return {
                  ...decision,
                  toBlock: decisionPath._id,
                }
              })
            };
          }),
        };
  
        setBookDetails(fixedDecisions);
        setVisibility(fixedDecisions.public);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (editMode) {
      getBookById(bookId);
    } else {
      setBookDetails(initialState);
    };

    blockCounter = 1;
  }, [props.match.params]);

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

    const bookToSend = {
      ...bookDetails,
      public: visibility,
      blocks: bookDetails.blocks.map((block) => {
        return {
          title: block.title,
          content: block.content,
          decisions: block.decisions?.map((decision) => {
            let decisionPath = bookDetails.blocks.find(block => block._id === decision.toBlock);

            return {
              ...decision,
              toBlock: decisionPath.title
            }
          })
        };
      }),
    };

    if (editMode) {
      Books.update(bookToSend._id, bookToSend)
        .then((book) => { 
          props.history.push(`/user/books`);
        })
        .catch((error) => console.log(error));
    } else {
      Books.create(bookToSend)
        .then((book) => { 
          setBookDetails(initialState);
          props.history.push(`/user/books`);
        })
        .catch((error) => console.log(error));
    }
  };

  const addBlock = () => {
    const blocks = [...bookDetails.blocks, newBlock()];

    setBookDetails({ ...bookDetails, blocks });
  };

  const removeBlock = (block) => { 
    const blocks = bookDetails.blocks.filter((item) => item._id !== block._id);

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
  };

  const changeVisibility = () => {
    setVisibility(!visibility);
  };

  return (
    <div>
      <div className='is-flex is-justify-content-space-between'>
        <button className='button mt-2 is-primary is-outlined'onClick={() => editMode ? props.history.push('/user/books') : props.history.push('/books')}> ᐸ Go back</button>
        <div className='mt-2 is-flex is-align-items-center'>
          <h2 className='mr-3'>Visibility of the book:</h2>
          <div className='switch is-flex is-align-items-center'>
            <input checked={visibility} onChange={changeVisibility} className='checkboxPublic' id='visibility' type='checkbox'></input>
            <label className='visibility px-3 py-2' for='visibility' >Public</label>
            <label className='visibility px-3 py-2' for='visibility' >Private</label>
          </div>
        </div>
        
      </div>
      
      <h1 className='is-size-3 has-text-centered mt-2'>{ editMode ? `Editing ${bookDetails.title}` : 'Your adventure starts here...' }</h1>
      <div className='columns is-centered mt-4'>
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

          {bookDetails.blocks.map((block) => (
            <div className='has-background-light p-4 mt-4' key={block._id}>
              <div className='control mb-4'>
                <div className='is-flex is-justify-content-space-between'>
                  <label htmlFor={block.id}>Title of your block:</label>
                  {bookDetails.blocks.length > 1 ? <button  className='button is-small is-danger is-light ' onClick={() => removeBlock(block)}>Delete block</button> : <></>}
                </div>
                <input
                  className='input'
                  id={block._id}
                  name='title'
                  value={block.title}
                  onChange={handleBlockChange(block)}
                  required
                />
              </div>

              <div className='mb-4'>
                <label htmlFor='blockContent'>Content of your block:</label>
                <textarea
                  className='textarea'
                  id={block._id + 'blockContent'}
                  rows="4"
                  cols="50"
                  name='content'
                  value={block.content}
                  onChange={handleBlockChange(block)}
                  required
                />
              </div>

              {block.decisions?.map((decision) => (
                <div className='is-flex is-justify-content-space-between mb-2 is-flex-wrap-wrap' key={decision.id}>
                  <div>
                    <label className='pr-1'>Option:</label>
                    <input className='input is-inline is-small' name='option' onChange={handleDecisionChange(block, decision)} value={decision.option} required></input>
                  </div>
                  <div>
                    <label className='pr-1'>Title of the block where it leads:</label>
                    <select className='is-small select is-inline' name='toBlock' onChange={handleDecisionChange(block, decision)} required defaultValue={editMode ? decision.toBlock : ''}>
                      <option disabled value={''}>Select a block </option>
                      
                      {bookDetails.blocks.map((item) => (
                        <option key={item._id} value={item._id}>{item.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button className='button is-small is-danger is-light' type="button" onClick={() => removeLastDecision(block, decision.id)}>Detele decision</button>
                </div>
              ))}
              <button className='button is-small is-success block mt-2' type="button" onClick={() => addDecision(block)}>Add a decision</button>
            </div>
          ))}
          <button className='button is-normal is-success mt-4' type="button" onClick={() => {blockCounter++; addBlock();} }>Add new block</button>
          <div className='is-flex is-justify-content-center my-6'>
            <button className='button is-normal is-primary' type='submit'>Submit your story</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAndCreateBook;