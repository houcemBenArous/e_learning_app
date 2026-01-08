import api from './axios';

export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/admin/statistics');
    return response.data;
  },

  getAllInstructors: async () => {
    const response = await api.get('/admin/instructors');
    return response.data;
  },

  getAllStudents: async () => {
    const response = await api.get('/admin/students');
    return response.data;
  },

  getAllCourses: async () => {
    const response = await api.get('/admin/courses');
    return response.data;
  },

  deleteInstructor: async (id) => {
    const response = await api.delete(`/admin/instructors/${id}`);
    return response.data;
  },

  createInstructor: async (instructorData) => {
    const response = await api.post('/auth/create-instructor', instructorData);
    return response.data;
  },
};