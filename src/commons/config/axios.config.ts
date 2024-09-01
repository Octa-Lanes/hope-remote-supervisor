import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    process.env.SERVER_URL || 'https://api-hope-remote-staging.8lanes.co',
  headers: {
    Authorization: process.env.AUTH_TOKEN,
  },
});

axiosInstance.interceptors.request.use((config) => {
  return config;
});

export default axiosInstance;
