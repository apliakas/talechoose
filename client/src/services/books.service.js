import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:5000/',
  withCredentials: true,
});

const getAll = () => {
  return request.get('/books').then((response) => response.data);
};

const getById = (id) => {
  return request.get(`/book/${id}`).then((response) => response.data);
};

const create = (bookDetails) => {
  return request.post('/book/', bookDetails).then((response) => response.data);
};

const deleteById = (id) => {
  return request.delete(`/book/${id}`).then((response) => response.data);
};

export default {
  getAll,
  getById,
  create,
  deleteById,
};