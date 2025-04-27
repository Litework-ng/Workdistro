// services/service.ts

import api from '@/lib/api';

// Define the Service type
export interface Service {
  id: number;
  name: string;
}

export const serviceService = {
  getServices: async (): Promise<Service[]> => {
    const response = await api.get('service/');
    return response.data; // List of services
  },

  createService: async (serviceData: { name: string }): Promise<Service> => {
    const response = await api.post('service/', serviceData);
    return response.data; // The created service
  },
};
