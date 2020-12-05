import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import AuthService from '../../components/Services/auth.service'

const initialState = { username: '', password: ''}

const Signup = (props) => {
  const [signupForm, setSignupForm] = useState(initialState)
  const [errMessage, setErrMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignupForm({ ...signupForm, [name]: value });
  }

  const service = new AuthService();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { username, password } = signupForm;

    service
      .signup(username, password)
      .then((response) => {
        setSignupForm(initialState)
        props.getUser(response)
      })
      .catch((error) => {
        const { message } = error.response.data;
        setErrMessage(message)
        console.log(error.response)
      })
  }
  
  return (
    <div>
      <form onSubmit={handleFormSubmit} >
        <label htmlFor='username' >Username:</label>
        <input id='username' type='text' name='username' value={signupForm.username} onChange={handleChange} />

        <label htmlFor='password' >Password :</label>
        <input id='password' type='password' name='password' value={signupForm.password} onChange={handleChange} />

        <button type='submit'>Submit</button>
      </form>

      {errMessage && <p style={{ color: 'red' }} >{errMessage}</p>}
    </div>
  );
};

export default Signup;