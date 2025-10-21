import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const createEvent = async (payload) => {
  // console.log('payload----------------_>', payload);
  const { data } = await API.post('/events', payload);
  // console.log('create event--------------->', data);
  return data;
};

export const getAllEvents = async (userId) => {
  // console.log('-----------------', userId);
  const { data } = await API.get(`/events/getAllEvents/${userId}`);
  return data;
};

export const updateEvent = async (payload) => {
  // console.log('update -------------->event', payload);
  const { data } = await API.put('/events', payload);
  // console.log('------------------------------------------>', data);
  return data;
};
export const getEventLogs = async (eventId) => {
  // console.log('logssss-----------', eventId);
  const { data } = await API.get(`/events/logs/${eventId}`);
  // console.log('log ------------------> from api', data);
  return data;
};
