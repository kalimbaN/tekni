import { useState, useEffect } from 'react';
import { 
  register as registerService, 
  login as loginService, 
  getCurrentUser, 
  changePassword as changePasswordService,
  logout as logoutService,
  getStoredUser,
  getStoredToken
} from '../services/auth.service';

export const useAuth = () => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getStoredToken());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getStoredUser());
      setToken(getStoredToken());
      setIsAuthenticated(!!getStoredToken());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-logout', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-logout', handleStorageChange);
    };
  }, []);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerService(userData);
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        setIsAuthenticated(true);
      } else {
        setError(response.message);
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(email, password);
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.token);
        setIsAuthenticated(true);
      } else {
        setError(response.message);
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await changePasswordService(oldPassword, newPassword);
      if (!response.success) {
        setError(response.message);
      }
      return response;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    fetchCurrentUser,
    changePassword,
    logout,
  };
};