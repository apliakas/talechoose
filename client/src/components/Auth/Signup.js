import React, { useState } from 'react';

import Auth from '../../services/auth.service';

const initialState = { username: '', password: '' };

const Signup = (props) => {
  const [signupDetails, setSignupDetails] = useState(initialState);
  const [signupErrorMessage, setSignupErrorMessage] = useState('');
  
  const handleFormSubmit = (event) => {
    event.preventDefault();

    Auth
      .signup(signupDetails)
      .then((user) => {
        setSignupDetails(initialState);
        props.setUser(user);
      })
      .catch((error) => {
        setSignupErrorMessage(error?.response?.data?.message || 'There has been an error, try again later.');
      });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSignupDetails({ ...signupDetails, [name]: value});
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} >
        <label htmlFor='username'>Username:</label>
        <input
          id='username'
          name='username'
          value={signupDetails.username}
          onChange={handleChange}
        />

        <label htmlFor='password'>Password:</label>
        <input
          id='password'
          type='password'
          name='password'
          value={signupDetails.password}
          onChange={handleChange}
        />

        <button type='submit'>Signup</button>
      </form>

      {signupErrorMessage && <p style={{ color: 'red' }} >{signupErrorMessage}</p>}
    </div>
  );
};

export default Signup;
