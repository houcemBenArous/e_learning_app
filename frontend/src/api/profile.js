import api from './axios';

export const profileAPI = {
  getMyProfile: async () => {
    const response = await api.get('/profile/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.post('/profile', profileData);
    return response.data;
  },
};