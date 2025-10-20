import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;

const API = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const createUser = async (name) => {
  const response = await API.post('/users', { name });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await API.get('/users');
  // console.log('response------------->', response);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await API.get(`/users/${id}`);
  return response.data;
};
