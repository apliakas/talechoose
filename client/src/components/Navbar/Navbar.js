import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../Services/auth.service'

const Navbar = (props) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const service = new AuthService;

  useEffect(() => {
    setLoggedInUser(props.userInSession);
  }, [props.userInSession]);

  const logoutUser = () => {
    service
      .logout()
      .then(() =>{
        setLoggedInUser(null);
        props.getUser(null);
      })
  }

  if (loggedInUser) {
    return (
      <nav>
        <h3>
          Welcome, {loggedInUser.username}
        </h3>
        <h3>
          <Link to='/books'>Books</Link>
        </h3>
        <h3>
          <Link to='/book/create'>Create a book</Link>
        </h3>
        <button onClick={logoutUser} >Logout</button>
      </nav>
    );
  } else {
    return (
      <nav>
        <h3>
          <Link to='/signup'>Signup</Link>
        </h3>
        <h3>
          <Link to='/login'>Login</Link>
        </h3>
        <h3>
          <Link to='/books'>Books</Link>
        </h3>
      </nav>
    );
  }
  
};

export default Navbar;