import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_TARGET; // viene del .env

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-CSRF-Token';