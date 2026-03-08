// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Requête API:', config.method.toUpperCase(), config.url);
  return config;
});

// Service de login
export const login = async (email, password) => {
  try {
    console.log('Tentative de login avec:', email);
    const response = await api.post('/login', { email, password });
    console.log('Réponse login:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout');
    return response.data;
  } catch (error) {
    console.error('Erreur logout:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/me');
    return response.data;
  } catch (error) {
    console.error('Erreur getProfile:', error);
    throw error;
  }
};

export default api;