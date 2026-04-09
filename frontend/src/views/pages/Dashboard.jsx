import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { healthCheck } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, fetchCurrentUser, changePassword, loading } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [healthStatus, setHealthStatus] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefreshProfile = async () => {
    await fetchCurrentUser();
  };

  const handleHealthCheck = async () => {
    const result = await healthCheck();
    setHealthStatus(result);
    setTimeout(() => setHealthStatus(null), 5000);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError({});
    setPasswordSuccess('');
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    const response = await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
    
    if (response.success) {
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } else {
      setPasswordError({ general: response.message });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Tekni Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleHealthCheck} className="text-gray-600 hover:text-gray-900">
                Health Check
              </button>
              <button onClick={handleRefreshProfile} className="text-gray-600 hover:text-gray-900">
                Refresh
              </button>
              <button onClick={() => setShowPasswordModal(true)} className="text-gray-600 hover:text-gray-900">
                Change Password
              </button>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {healthStatus && (
        <div className="max-w-7xl mx-auto mt-4 px-4">
          <div className={`p-4 rounded-md ${healthStatus.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p>Status: {healthStatus.status}</p>
            <p>App: {healthStatus.app}</p>
            <p>Time: {healthStatus.timestamp}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user.full_name}!</h2>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone}</p>
              </div>
              
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-medium capitalize">{user.user_type}</p>
              </div>
              
              <div className="border-b pb-3">
                <p className="text-sm text-gray-500">Verified Status</p>
                <p className="font-medium">{user.is_verified ? 'Verified' : 'Not Verified'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              <button onClick={() => {
                setShowPasswordModal(false);
                setPasswordError({});
                setPasswordSuccess('');
                setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
              }} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                  {passwordError.confirmPassword && <p className="text-red-500 text-xs mt-1">{passwordError.confirmPassword}</p>}
                </div>
              </div>
              
              {passwordError.general && <div className="mt-4 text-red-500 text-sm">{passwordError.general}</div>}
              {passwordSuccess && <div className="mt-4 text-green-500 text-sm">{passwordSuccess}</div>}
              
              <div className="mt-6 flex space-x-3">
                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button type="button" onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError({});
                  setPasswordSuccess('');
                  setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                }} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;