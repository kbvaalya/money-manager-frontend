import axios from 'axios';

const API_BASE_URL = "https://money-manager-du1j.onrender.com/api/v1.0";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const publicEndpoints = ['/register', '/login', '/activate'];

        const isPublic = publicEndpoints.some(endpoint => config.url.endsWith(endpoint));

        if (token && !isPublic) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
