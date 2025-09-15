import api from '@/lib/api';
import { AuthResponse,  } from '@/shared/types/auth';


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

interface OtpData {
  email: string;
  otp: string;
}

interface ForgotPasswordParams {
  email: string;
}

interface ResetPasswordParams {
  otp: string;
  email: string;
  password: string;
}

interface VerifyPhoneOtpData {
  otp: string;
}


export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('register/', data);
    return response.data;
  },
  
  verifyOtp: async (data: OtpData) => {
    const response = await api.post('otp/', data);
    return response.data;
  },

  sendOtp: async ({ email }: { 
    email: string;
    registrationData: any;
  }) => {
    const response = await api.get('otp', { params: { email } });
    return response.data;
  },
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('login/', data);
    return response.data;
  },
  forgotPassword: async (params: ForgotPasswordParams) => {
    const response = await api.post('user/forgotten-password/', params);
    return response.data;
  },
  resetPassword: async (params: ResetPasswordParams) => {
    const response = await api.put('user/forgotten-password/', params);
    return response.data;
  },
 sendPhoneOtp: async (phone_number: string) => {
    const formattedNumber = phone_number.startsWith('+')
      ? phone_number
      : '+234' + phone_number.replace(/^0/, '');

    const response = await api.post('verify-phone', { phone_number: formattedNumber });
    return response.data;
  },



 verifyPhoneOtp: async (otp: string) => {
  console.log("Mock verify OTP:", otp);
  return { success: true, message: "OTP verified (mocked)" };
},
};