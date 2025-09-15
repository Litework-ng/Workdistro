import api from '@/lib/api';

export const taskService = {
  createTask: async (formData: FormData) => {
    const response = await api.post('user/job/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateTask: async (jobId: string, formData: FormData) => {
    const response = await api.put(`user/job/${jobId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteTask: async (jobId: string) => {
    const response = await api.delete(`user/job/action/${jobId}/`);
    return response.data;
  },

  getTask: async (jobId: string) => {
    const response = await api.get(`job/${jobId}/`);
    return response.data;
  },
};