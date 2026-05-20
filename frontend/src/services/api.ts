import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Automatic session logout on token expiry
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

export default api;
