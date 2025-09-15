import api from '@/lib/api';

export const walletService = {
  async getWallet() {
    const response = await api.get('wallet/');
    return response.data; 
  },
   async createReservedAccount(data: { BVN?: string; NIN?: string; Name?: string; mobileNo?: string; dateOfBirth?: string; }) {
    const response = await api.post('/wallet/', data);
    return response.data;
  },
};