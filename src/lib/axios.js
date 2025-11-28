import axios from 'axios';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: { "Content-Type": "application/json"}
});

api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-CSRF-Token';