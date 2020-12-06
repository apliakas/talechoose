import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../Services/auth.service';

const initialState = { username: '', password: ''};

const Login = (props) => {
  const [loginForm, setLoginForm] = useState(initialState);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  
  const service = new AuthService();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { username, password } = loginForm;

    service
      .login(username, password)
      .then((response) => {
        setLoginForm(initialState)
        props.getUser(response);
      })
      .catch((error) => {
        const { message } = error.response.data;
        setLoginErrorMsg(message);
        console.log(error);
      })
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginForm({ ...loginForm, [name]: value});
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit} >
        <label htmlFor='username' >Username:</label>
        <input id='username' type='text' name='username' value={loginForm.username} onChange={handleChange} />

        <label htmlFor='password' >Password :</label>
        <input id='password' type='password' name='password' value={loginForm.password} onChange={handleChange} />

        <button type='submit'>Login</button>
      </form>

      {loginErrorMsg && <p style={{ color: 'red' }} >{loginErrorMsg}</p>}
    </div>
  )
}

export default Login;
