import api from '@/lib/api';

export const taskService = {

  hireWorker: async (jobId: string, bidId: string) => {
    const response = await api.post(
      `user/job/hire/${jobId}/`,
      { bid_id: bidId }
    );
    return response.data;
  },

   updateHireStatus: async (bidId: string, answer: 'yes' | 'no') => {
    const response = await api.post(
      `/worker/available/${bidId}/`,
      { answer }
    );
    return response.data;
  },
};
