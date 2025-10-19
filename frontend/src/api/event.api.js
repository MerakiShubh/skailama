import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const createEvent = async (payload) => {
  console.log('payload----------------_>', payload);
  const { data } = await API.post('/events', payload);
  console.log('create event--------------->', data);
  return data;
};

export const getAllEvents = async (userId) => {
  const { data } = await API.post('/events/getAllEvents', { userId });
  return data;
};

export const updateEvent = async (payload) => {
  const { data } = await API.put('/event', payload);
  return data;
};

export const getEventLogs = async (eventId) => {
  const { data } = await API.get('/event/logs', {
    data: { eventId },
  });
  return data;
};
