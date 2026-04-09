import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { healthCheck } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [health, setHealth] = useState(null);

  useEffect(() => {
    healthCheck().then(setHealth).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl md:text-7xl">
            <span className="block">Welcome to</span>
            <span className="block text-indigo-600">Tekni Platform</span>
          </h1>
          <p className="mt-6 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
            Connect with commission agents, service providers, and individual sellers all in one place.
          </p>
          
          {health && health.status === 'ok' && (
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              ● API Connected
            </div>
          )}
          
          <div className="mt-8 flex justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Get Started
                </Link>
                <Link to="/login" className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;