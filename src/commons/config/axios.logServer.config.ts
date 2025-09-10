import axios from 'axios';

const axiosLogServerInstance = axios.create({
  baseURL: process.env.LOG_SERVER_URL,
  headers: {
    Authorization: process.env.AUTH_TOKEN,
  },
});

axiosLogServerInstance.interceptors.request.use((config) => {
  return config;
});

export default axiosLogServerInstance;
