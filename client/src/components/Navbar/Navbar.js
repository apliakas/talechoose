import React, { useState } from 'react';

import { Link, useHistory } from 'react-router-dom';

import Auth from '../../services/auth.service';

import './Navbar.scss';

import logo from '../../static/logo.svg';

const Navbar = (props) => {
  const [isActive, setIsActive] = useState(false);

  const history = useHistory();

  const logoutUser = () => {
    Auth
      .logout()
      .then(() => {
        props.setUser(null);
        history.push(`/`);
      });
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link to='/' className="navbar-item">
          <img src={logo}></img>
        </Link>

        <a onClick={() => {
              setIsActive(!isActive)
            }}
            role="button" 
            className={`navbar-burger burger ${isActive ? 'is-active' : ''}`} 
            aria-label="menu" 
            aria-expanded="false" 
            data-target="navbarBasicExample"
          >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      

        <div className="navbar-end">

        <div id="navbarBasicExample" className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
        <div className="navbar-start">
          <Link to='/books' className="navbar-item" >Public books</Link>
          { props.user && (
            <>
              <Link to='/user/favourite-books' className='navbar-item'>Fav. Books</Link>
              <Link to='/user/books' className="navbar-item" >My books</Link> 
              <Link to='/book/create' className="navbar-item" >Create a book</Link>
            </>
          )}
        </div>

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