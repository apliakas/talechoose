import axios from 'axios';

const request = axios.create({
  baseURL: process.env.REACT_APP_BACKEND || 'http://localhost:5000/api',
  withCredentials: true,
});

const user = {};

user.update = (userId, updatedUser) => {
  return request.post(`/user/${userId}/update`, updatedUser).then((response) => response.data);
};

export default user;