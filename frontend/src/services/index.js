import api from './api';

export const authService = {
  register: (email, password, role) => api.post('/auth/register', { email, password, role }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
};

export const memberService = {
  getAll: () => api.get('/members'),
  getById: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
  getNotSeenRecently: () => api.get('/members/not-seen-recently'),
};

export const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  checkIn: (eventId, memberId) => api.post(`/events/${eventId}/checkin/${memberId}`),
  getAttendance: (eventId) => api.get(`/events/${eventId}/attendance`),
};

export const taskService = {
  getAll: () => api.get('/tasks'),
  getByMember: (memberId) => api.get(`/tasks/member/${memberId}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getNotesByMember: (memberId) => api.get(`/tasks/notes/member/${memberId}`),
  createNote: (data) => api.post('/tasks/notes', data),
};

export const insightService = {
  generate: (memberId) => api.post(`/insights/member/${memberId}`),
  getByMember: (memberId) => api.get(`/insights/member/${memberId}`),
};
