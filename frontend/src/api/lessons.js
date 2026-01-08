import api from './axios';

export const lessonsAPI = {
  getByCourse: async (courseId) => {
    const response = await api.get(`/lessons/course/${courseId}`);
    return response.data;
  },

  create: async (lessonData) => {
    const response = await api.post('/lessons', lessonData);
    return response.data;
  },

  update: async (id, lessonData) => {
    const response = await api.put(`/lessons/${id}`, lessonData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  },
};