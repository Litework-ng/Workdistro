import api from '@/lib/api';

interface UpdateUserData {
  name: string;
  location: string;
  about_me?: string;
}

export const userService = {
  updateUser: async (data: UpdateUserData) => {
    const response = await api.put('user/', data);
    return response.data;
  },


    getUser: async () => {
    const response = await api.get('user/');
    return response.data.response;
  },
};