import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://workdistro-1.onrender.com/api/',
  timeout: 300000, // Adjust timeout as needed
  headers: {
    'Content-Type': 'application/json',
    // You can add other default headers here
  }
});

export default instance;