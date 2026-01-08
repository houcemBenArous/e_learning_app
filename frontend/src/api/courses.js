import api from './axios';

// Courses API functions
export const coursesAPI = {
  // Get all courses
  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get course by ID
  getById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Create course (instructor only)
  create: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Update course (instructor only)
  update: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Delete course (instructor only)
  delete: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Enroll in course (student only)
  enroll: async (courseId) => {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  },
};