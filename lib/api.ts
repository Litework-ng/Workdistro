import axios from 'axios';
import { useAuthStore } from '@/shared/stores/useAuthStore';

const instance = axios.create({
  baseURL: 'https://workdistro-backend-1.onrender.com/api/',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    // Do not add Authorization for login or register endpoints
    const skipAuth = config.url?.includes('login') || config.url?.includes('register');
    if (token && !skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Full server error response
      console.log("API Error Response:", error.response.data);

      // Status code
      console.log("Status:", error.response.status);

      // Request details
      console.log("Request URL:", error.config?.url);
      console.log("Request Method:", error.config?.method);

      // Try to extract a human-friendly message
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.data?.detail ||
        error.response.data?.response ||
        JSON.stringify(error.response.data);

      console.log("Error Message:", message);

      return Promise.reject({
        status: error.response.status,
        message,
        data: error.response.data,
      });
    } else if (error.request) {
      // No response (network issue, timeout, etc.)
      console.log("API Error: No response from server", error.request);
      return Promise.reject({
        status: null,
        message: "No response from server",
      });
    } else {
      // Error setting up the request
      console.log("API Error: Request setup failed", error.message);
      return Promise.reject({
        status: null,
        message: error.message,
      });
    }
  }
);


export default instance;