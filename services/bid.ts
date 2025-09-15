import api from '@/lib/api';

interface BidData {
  job_id: string;
  cover_letter: string;
  bid: string;
}

export const bidService = {
  // Create a new bid
  createBid: async (data: BidData) => {
    const response = await api.post('worker/bid/', data);
    return response.data;
  },

  // Get bids for a specific job
  getJobBids: async (jobId: string) => {
    const response = await api.get(`user/jobs/${jobId}/bids/`);
    return response.data;
  },

  // Get bids made by the current worker
  getWorkerBids: async () => {
    const response = await api.get('/bid/worker/');
    return response.data;
  },

  // Update bid status (for client actions)
  updateBidStatus: async (bidId: string, status: 'accepted' | 'rejected') => {
    const response = await api.patch(`/bid/${bidId}/`, { status });
    return response.data;
  },

    withdrawBid: async (bidId: string) => {
    const response = await api.delete('worker/bid/', {
      data: { bid_id: bidId }
    });
    return response.data;
  },
};