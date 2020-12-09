import React, { useState } from 'react';

import Auth from '../../services/auth.service';

const initialState = { username: '', password: '' };

const Login = (props) => {
  const [loginDetails, setLoginDetails] = useState(initialState);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  
  const handleFormSubmit = (event) => {
    event.preventDefault();

    Auth
      .login(loginDetails)
      .then((user) => {
        setLoginDetails(initialState);
        props.history.push(`/books`);
        props.setUser(user);
      })
      .catch((error) => {
        setLoginErrorMessage(error?.response?.data?.message);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginDetails({ ...loginDetails, [name]: value});
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} >
        <label htmlFor='username'>Username:</label>
        <input
          id='username'
          name='username'
          value={loginDetails.username}
          onChange={handleChange}
        />

        <label htmlFor='password'>Password:</label>
        <input
          id='password'
          type='password'
          name='password'
          value={loginDetails.password}
          onChange={handleChange}
        />

        <button type='submit'>Login</button>
      </form>

      {loginErrorMessage && <p style={{ color: 'red' }} >{loginErrorMessage}</p>}
    </div>
  );
};

export default Login;
