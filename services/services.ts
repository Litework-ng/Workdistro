import api from '@/lib/api';
import { Service } from '@/shared/types/service';

interface ServiceRequest {
  s_id: string;
}

export const serviceService = {
  getServices: async (): Promise<Service[]> => {
    try {
      const response = await api.get('service/');
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  createService: async (serviceData: { id: number }): Promise<Service> => {
    try {
      // Transform the input data to match API requirements
      const requestData: ServiceRequest = {
        s_id: serviceData.id.toString()  // Convert number to string
      };
      
      console.log('Creating service with data:', requestData);
      const response = await api.post('service/', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },
};