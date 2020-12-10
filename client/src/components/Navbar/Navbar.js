import React from 'react';

import { Link } from 'react-router-dom';

import Auth from '../../services/auth.service';

import './Navbar.css';

const Navbar = (props) => {
  const logoutUser = () => {
    Auth
      .logout()
      .then(() => {
        props.setUser(null);
      });
  };

  return (
    <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <Link to='/' className="navbar-item">
            SomeText
          </Link>
          <Link to='/books' className="navbar-item" >All books</Link>
          { props.user && (
            <>
              <Link to='/user/books' className="navbar-item" >My books</Link> 
              <Link to='/book/create' className="navbar-item" >Create a book</Link>
            </>
          )}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              { !props.user && (
                <>
                  <Link to='/signup' className="button is-primary">
                    <strong>Sign up</strong>
                  </Link>
                  <Link to='/login' className="button is-light">
                    <strong>Log in</strong>
                  </Link>
                </>
              ) }
              { props.user && (                
                <button onClick={ logoutUser } className="button is-light">
                  <strong>Sign out</strong>
                </button>
              ) }
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;