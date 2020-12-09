import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

const auth = {};

auth.signup = (signupDetails) => {
  return request.post('/signup', signupDetails).then((response) => response.data);
};

auth.login = (loginDetails) => {
  return request.post('/login', loginDetails).then((response) => response.data);
};

auth.logout = () => {
  return request.post('/logout', {}).then((response) => response.data);
};

auth.isAuthenticated = () => {
  return request.get('/loggedin').then((response) => response.data);
};

export default auth;