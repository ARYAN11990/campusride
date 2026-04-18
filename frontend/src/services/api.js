import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('campusride_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
