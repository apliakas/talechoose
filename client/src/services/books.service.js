import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

const books = {};

books.getAll = () => {
  return request.get('/books').then((response) => response.data);
};

books.getById = (id) => {
  return request.get(`/book/${id}`).then((response) => response.data);
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

books.deleteById = (id) => {
  return request.delete(`/book/${id}`).then((response) => response.data);
};

export default books;