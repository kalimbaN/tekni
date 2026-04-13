import axios from 'axios';

// Keep your existing base URLs
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tekni-4.onrender.com/api';
const API_BASE_URL_RAW = import.meta.env.VITE_API_BASE_URL || 'https://tekni-4.onrender.com';

// Create axios instance with your existing base URL
const API = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// Add token to all requests automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for 401 handling (like your existing code)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth-logout'));
        }
        return Promise.reject(error);
    }
);

// Keep your existing healthCheck for compatibility
export const healthCheck = async () => {
    const response = await fetch(`${API_BASE_URL_RAW}/health`);
    return response.json();
};

// Keep your existing apiFetch for backward compatibility
const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
    
    const config = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers },
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok && response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('auth-logout'));
        }
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Export both for flexibility
export default API;
export { apiFetch };