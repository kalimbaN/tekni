import { 
  register as registerService, 
  login as loginService, 
  getCurrentUser, 
  changePassword as changePasswordService,
  logout as logoutService,
  isAuthenticated,
  getStoredUser
} from '../services/auth.service';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+250[0-9]{9}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRegistration = (formData) => {
  const errors = {};
  
  if (!formData.email) errors.email = 'Email is required';
  else if (!validateEmail(formData.email)) errors.email = 'Invalid email format';
  
  if (!formData.phone) errors.phone = 'Phone number is required';
  else if (!validatePhone(formData.phone)) errors.phone = 'Phone must be +250XXXXXXXXX format';
  
  if (!formData.password) errors.password = 'Password is required';
  else if (!validatePassword(formData.password)) errors.password = 'Password must be at least 6 characters';
  
  if (!formData.full_name) errors.full_name = 'Full name is required';
  
  if (!formData.user_type) errors.user_type = 'User type is required';
  
  return errors;
};

export const validateLogin = (formData) => {
  const errors = {};
  
  if (!formData.email) errors.email = 'Email is required';
  if (!formData.password) errors.password = 'Password is required';
  
  return errors;
};

export const validatePasswordChange = (formData) => {
  const errors = {};
  
  if (!formData.oldPassword) errors.oldPassword = 'Current password is required';
  if (!formData.newPassword) errors.newPassword = 'New password is required';
  else if (!validatePassword(formData.newPassword)) errors.newPassword = 'Password must be at least 6 characters';
  if (formData.newPassword !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  
  return errors;
};

export const handleRegister = async (formData, onSuccess, onError) => {
  const errors = validateRegistration(formData);
  if (Object.keys(errors).length > 0) {
    onError(errors);
    return false;
  }
  
  const response = await registerService(formData);
  if (response.success) {
    onSuccess(response.data);
    return true;
  } else {
    onError({ general: response.message });
    return false;
  }
};

export const handleLogin = async (email, password, onSuccess, onError) => {
  const errors = validateLogin({ email, password });
  if (Object.keys(errors).length > 0) {
    onError(errors);
    return false;
  }
  
  const response = await loginService(email, password);
  if (response.success) {
    onSuccess(response.data);
    return true;
  } else {
    onError({ general: response.message });
    return false;
  }
};

export const handleLogout = () => {
  logoutService();
};

export const handleChangePassword = async (oldPassword, newPassword, confirmPassword, onSuccess, onError) => {
  const errors = validatePasswordChange({ oldPassword, newPassword, confirmPassword });
  if (Object.keys(errors).length > 0) {
    onError(errors);
    return false;
  }
  
  const response = await changePasswordService(oldPassword, newPassword);
  if (response.success) {
    onSuccess(response.message);
    return true;
  } else {
    onError({ general: response.message });
    return false;
  }
};

export const isUserAuthenticated = () => {
  return isAuthenticated();
};

export const getCurrentUserProfile = () => {
  return getStoredUser();
};