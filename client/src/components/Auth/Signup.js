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
        props.history.push(`/books`);
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
    <>
    <div className="columns is-centered mt-6">
      <div className="column is-one-third">
        <form onSubmit={handleFormSubmit}>
          <h1 className="mb-4 is-size-1 has-text-centered">Sign up</h1>
          <div className="field">
            <label class="label">Username</label>
            <div class="control">
              <input
                className="input"
                id='username'
                name='username'
                placeholder='Username'
                value={signupDetails.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field">
            <label class="label">Password</label>
            <div class="control">
              <input
                className="input"
                type='password'
                name='password'
                placeholder="Password"
                value={signupDetails.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div class="control has-text-centered">
            <button class="button is-primary">Sign up</button>
          </div>
        </form>
        {signupErrorMessage && <p style={{ color: 'red' }} >{signupErrorMessage}</p>}
      </div>
      <p></p>
    </div>
    </>
  );
};

export default Signup;
