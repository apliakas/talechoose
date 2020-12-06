import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:5000/',
  withCredentials: true,
});

const signup = (signupDetails) => {
  return request.post('/signup', signupDetails).then((response) => response.data);
};

const login = (loginDetails) => {
  return request.post('/login', loginDetails).then((response) => response.data);
};

const logout = () => {
  return request.post('/logout', {}).then((response) => response.data);
};

const isAuthenticated = () => {
  return request.get('/loggedin').then((response) => response.data);
};

export default {
  signup,
  login,
  logout,
  isAuthenticated,
};