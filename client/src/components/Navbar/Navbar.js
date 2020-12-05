import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {

  return (
    <nav>
      <h3>
        <Link to='/books'>Books</Link>
      </h3>
      <h3>
        <Link to='/book/create'>Create a book</Link>
      </h3>
    </nav>
  );
};

export default Navbar;