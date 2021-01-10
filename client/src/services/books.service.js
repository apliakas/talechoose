import axios from 'axios';

const request = axios.create({
  baseURL: process.env.REACT_APP_BACKEND || 'http://localhost:5000/api',
  withCredentials: true,
});

const books = {};

books.getAll = () => {
  return request.get('/books').then((response) => response.data);
};

books.getById = (id, allBlocks = false) => {
  return request.get(`/book/${id}${allBlocks ? '?allBlocks=true' : ''}`).then((response) => response.data);
};

books.getBlockByTitle = (id, title) => {
  return request.get(`/book/${id}/${title}`).then((response) => response.data);
};

books.getByUser = (userId) => {
  return request.get(`/books/user/${userId}`).then((response) => response.data);
};

books.create = (bookDetails) => {
  return request.post('/book', bookDetails).then((response) => response.data);
};

books.update = (id, updatedBook) => {
  return request.post(`/book/${id}`, updatedBook).then((response) => response.data);
};

books.deleteById = (id) => {
  return request.delete(`/book/${id}`).then((response) => response.data);
};

export default books;