import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.SERVER_URL || 'https://test-api-hope-remote.8lanes.co',
  headers: {
    Authorization: process.env.AUTH_TOKEN,
  },
});

export default axiosInstance;
