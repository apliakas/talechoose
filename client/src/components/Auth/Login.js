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
    <div className="columns is-centered mt-6">
      <div className="column is-one-third">
        <form onSubmit={handleFormSubmit}>
          <h1 className="mb-4 is-size-1 has-text-centered">Log in</h1>
          <div className="field">
            <label className="label">Username</label>
            <div className="control">
              <input
                className="input"
                id='username'
                name='username'
                placeholder='Username'
                value={loginDetails.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type='password'
                name='password'
                placeholder="Password"
                value={loginDetails.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="control has-text-centered">
            <button className="button is-primary">Log in</button>
          </div>
        </form>
        {loginErrorMessage && <p style={{ color: 'red' }} >{loginErrorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;
