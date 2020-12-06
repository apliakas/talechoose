import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import Auth from '../../services/auth.service';

const Navbar = (props) => {
  const logoutUser = () => {
    Auth
      .logout()
      .then(() => {
        props.setUser(null);
      });
  };

  return (
    <nav>
      { !props.user && <h3><Link to='/signup'>Signup</Link></h3> }
      { !props.user && <h3><Link to='/login'>Login</Link></h3> }
      
      { props.user && <h3>Welcome, { props.user.username }</h3> }
      <h3><Link to='/books'>Books</Link></h3>
      { props.user && <h3><Link to='/book/create'>Create a book</Link></h3> }
      { props.user && <button onClick={ logoutUser }>Logout</button> }
    </nav>
  );
};

export default Navbar;