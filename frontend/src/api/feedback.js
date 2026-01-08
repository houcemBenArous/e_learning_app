import api from './axios';

export const feedbackAPI = {
  create: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  getByCoursе: async (courseId) => {
    const response = await api.get(`/feedback/course/${courseId}`);
    return response.data;
  },

  getByInstructor: async (instructorId) => {
    const response = await api.get(`/feedback/instructor/${instructorId}`);
    return response.data;
  },

  getMyFeedback: async () => {
    const response = await api.get('/feedback/my-feedback');
    return response.data;
  },

  update: async (feedbackId, feedbackData) => {
    const response = await api.put(`/feedback/${feedbackId}`, feedbackData);
    return response.data;
  },

  delete: async (feedbackId) => {
    const response = await api.delete(`/feedback/${feedbackId}`);
    return response.data;
  },

  markHelpful: async (feedbackId) => {
    const response = await api.post(`/feedback/${feedbackId}/helpful`);
    return response.data;
  },
};