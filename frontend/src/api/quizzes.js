import api from './axios';

export const quizzesAPI = {
  getByCourse: async (courseId) => {
    const response = await api.get(`/quizzes/course/${courseId}`);
    return response.data;
  },

  create: async (quizData) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  update: async (id, quizData) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
};