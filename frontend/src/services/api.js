// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://tekni-4.onrender.com/api';
const API_BASE_URL_RAW = import.meta.env.VITE_API_BASE_URL || 'https://tekni-4.onrender.com';

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok && response.status === 401) {
      // Token expired or invalid
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

// Health check (no auth needed)
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL_RAW}/health`);
  return response.json();
};

export default apiFetch;