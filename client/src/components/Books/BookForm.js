import React, { useState, useEffect } from 'react';

import Books from '../../services/books.service';

import './BookForm.scss';

const newDecision = () => ({
  id: +new Date(),
  option: 'Continue',
  toBlock: '',
});

const newBlock = (blockNumber) => ({
  _id: `${+new Date()}`,
  title: `Block ${blockNumber}`,
  content: '',
});

const newBook = (blockNumber) => ({
  title: '',
  blocks: [newBlock(blockNumber)],
  public: true,
});

const BookForm = (props) => {
  const [blockNumber, setBlockNumber] = useState(1);
  const [book, setBook] = useState(newBook(blockNumber));

  const { id: bookId } = props.match.params;
  const editMode = !!bookId;

  useEffect(() => {
    if (editMode) {
      getBookById(bookId);
    } else if (book._id) {
      /**
       * In case the book stored on the state has a `_id`, it means that we come from the edit view,
       * and the state needs to be refreshed
       */
      setBook(newBook(blockNumber));
    }
  }, [props.match.params]);

  // PRIVATE FUNCTIONS
  function getBookById(id) {
    Books 
      .getById(id, true)
      .then((book) => {

        /**
         * There's a difference between how the books are stored and how are they used on this page.
         * This is because the `book.block.decisions` point to other blocks (`toBlock`) via their titles,
         * but this field can be modified, and then the link between a `decision` and a `block` would break
         * (as then there would not be a block with that title anymore).
         * In order to solve it, the book is parsed upon fetching, and the decisions point to other blocks
         * (`toBlock`) using their IDs.
         * This is later on parsed again before submitting, so the API can store the book with its decisions
         * pointing to other blocks (`toBlock`) using their titles.
         */
        const parsedBook = {
          ...book,
          blocks: book.blocks.map((block) => ({
            ...block,
            decisions: block.decisions?.map((decision) => {
              // On the database, the decision points to the `block.title` (`decision.toBlock`)
              const matchingBlock = book.blocks.find((block) => block.title === decision.toBlock);

              return {
                ...decision,
                // On the application, the decision points to the `block._id` (`decision.toBlock`)
                toBlock: matchingBlock._id,
              }
            })
          })),
        };
  
        setBook(parsedBook);
      })
      .catch((err) => console.log(err));
  };

  // VIEW FUNCTIONS
  const handleBookChange = (event) => {
    const { name, value } = event.target;

    setBook({ ...book, [name]: value });
  };

  const handleBlockChange = (block) => (event) => {
    const { name, value } = event.target;

    const { blocks } = book;
    const index = blocks.indexOf(block);
    const total = blocks.length;

    const modifiedBlock = { ...block, [name]: value };

    const modifiedBlocks = [
      ...blocks.slice(0, index),
      modifiedBlock,
      ...blocks.slice(index + 1, total),
    ];
    
    setBook({ ...book, blocks: modifiedBlocks });
  };

  const handleDecisionChange = (block, decision) => (event) => {
    const { name, value } = event.target;

    const { blocks } = book;

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
    
    setBook({ ...book, blocks: modifiedBlocks });
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const bookToSend = {
      ...book,
      blocks: book.blocks.map((block) => {
        return {
          title: block.title,
          content: block.content,
          decisions: block.decisions?.map((decision) => {
            let decisionPath = book.blocks.find(block => block._id === decision.toBlock);

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
          setBook(newBook);
          props.history.push(`/user/books`);
        })
        .catch((error) => console.log(error));
    }
  };

  const addBlock = () => {
    setBlockNumber(blockNumber + 1);

    const blocks = [...book.blocks, newBlock(blockNumber)];

    setBook({ ...book, blocks });
  };

  const removeBlock = (block) => { 
    const blocks = book.blocks.filter((item) => item._id !== block._id);

    setBook({ ...book, blocks });
  }

  const addDecision = (block) => {
    const { blocks } = book;

    const decisions = [...(block.decisions || []), newDecision()];

    const blockIndex = blocks.indexOf(block);
    const totalBlocks = blocks.length;

    const modifiedBlock = { ...block, decisions };
    
    const modifiedBlocks = [
      ...blocks.slice(0, blockIndex),
      modifiedBlock,
      ...blocks.slice(blockIndex + 1, totalBlocks),
    ];

    setBook({ ...book, blocks: modifiedBlocks });
  };

  const removeLastDecision = (block, id) => {
    const { blocks } = book;

    const decisions = block.decisions.filter((decision) => decision.id !== id);

    const blockIndex = blocks.indexOf(block);
    const totalBlocks = blocks.length;

    const modifiedBlock = { ...block, decisions };
    
    const modifiedBlocks = [
      ...blocks.slice(0, blockIndex),
      modifiedBlock,
      ...blocks.slice(blockIndex + 1, totalBlocks),
    ];

    setBook({ ...book, blocks: modifiedBlocks });
  };

  const changeVisibility = () => {
    setBook({
      ...book,
      public: !book.public,
    });
  };

  return (
    <div>
      <div className='is-flex is-justify-content-space-between'>
        <button className='button mt-2 is-primary is-outlined'onClick={() => editMode ? props.history.push('/user/books') : props.history.push('/books')}> ᐸ Go back</button>
        <div className='mt-2 is-flex is-align-items-center'>
          <h2 className='mr-3'>Visibility of the book:</h2>
          <div className='switch is-flex is-align-items-center'>
            <input checked={book.public} onChange={changeVisibility} className='checkboxPublic' id='visibility' type='checkbox'></input>
            <label className='visibility px-3 py-2' for='visibility' >Public</label>
            <label className='visibility px-3 py-2' for='visibility' >Private</label>
          </div>
        </div>
        
      </div>
      
      <h1 className='is-size-3 has-text-centered mt-2'>{ editMode ? `Editing ${book.title}` : 'Your adventure starts here...' }</h1>
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
                value={book.title}
                onChange={handleBookChange}
                required
              />
            </div>
          </div>

          {book.blocks.map((block) => (
            <div className='has-background-light p-4 mt-4' key={block._id}>
              <div className='control mb-4'>
                <div className='is-flex is-justify-content-space-between'>
                  <label htmlFor={block.id}>Title of your block:</label>
                  {book.blocks.length > 1 ? <button  className='button is-small is-danger is-light ' onClick={() => removeBlock(block)}>Delete block</button> : <></>}
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
                      
                      {book.blocks.map((item) => (
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
          <button className='button is-normal is-success mt-4' type="button" onClick={addBlock}>Add new block</button>
          <div className='is-flex is-justify-content-center my-6'>
            <button className='button is-normal is-primary' type='submit'>Submit your story</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;