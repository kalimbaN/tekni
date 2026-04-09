import apiFetch from './api';

export const register = async (userData) => {
  const response = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (response.success) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response;
};

export const login = async (email, password) => {
  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.success) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response;
};

export const getCurrentUser = async () => {
  const response = await apiFetch('/auth/me', {
    method: 'GET',
  });
  
  if (response.success) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response;
};

export const changePassword = async (oldPassword, newPassword) => {
  const response = await apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  
  return response;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth-logout'));
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getStoredToken = () => {
  return localStorage.getItem('token');
};