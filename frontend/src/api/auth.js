import api from './axios';

// Authentication API functions
export const authAPI = {
  // Register a new student
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Create instructor (admin only)
  createInstructor: async (name, email, password) => {
    const response = await api.post('/auth/create-instructor', { name, email, password });
    return response.data;
  },
};