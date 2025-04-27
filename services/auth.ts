import api from '@/lib/api';

interface RegisterData {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('register/', data);
    return response.data;
  },
  verifyOtp: async ({ otp }: { otp: string }) => {
    const response = await api.post('verify-otp/', { otp });
    return response.data;
  },
  
  sendOtp: async ({ email }: { email: string }) => {
    const response = await api.post('send-otp/', { phone_number });
    return response.data;
  },
  login: async (data: LoginData) => {
    const response = await api.post('login/', data);
    return response.data;
  },
};