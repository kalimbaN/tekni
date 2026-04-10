import React from 'react';
import { Link } from 'react-router-dom';

const QuickCategories = () => {
  const categories = [
    { icon: '🔧', name: 'Services', description: 'Plumbers, electricians & more', color: 'from-blue-500 to-blue-600', href: '/services' },
    { icon: '📱', name: 'Used Items', description: 'Phones, furniture, cars', color: 'from-green-500 to-green-600', href: '/used-items' },
    { icon: '🏠', name: 'Properties', description: 'Houses, land, apartments', color: 'from-purple-500 to-purple-600', href: '/properties' },
    { icon: '📄', name: 'Tenders', description: 'Open bids & contracts', color: 'from-orange-500 to-orange-600', href: '/tenders' },
    { icon: '💼', name: 'Jobs', description: 'Full-time, part-time', color: 'from-teal-500 to-teal-600', href: '/jobs' },
    { icon: '🏗️', name: 'Land Plots', description: 'Buy, sell, or rent land', color: 'from-amber-500 to-amber-600', href: '/land-plots' },
    { icon: '🚗', name: 'Vehicles', description: 'Cars, motorcycles, bikes', color: 'from-red-500 to-red-600', href: '/vehicles' },
    { icon: '⭐', name: 'Featured', description: 'Premium listings', color: 'from-indigo-500 to-indigo-600', href: '/featured' },
  ];

  return (
    <div className="py-12 bg-grayMedium-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Browse by category</h2>
        <p className="text-center text-gray-500 mb-8">Find exactly what you're looking for</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.href}
              className={`bg-gradient-to-br ${cat.color} text-white rounded-xl p-4 text-center hover:scale-105 transition transform shadow-md hover:shadow-xl`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-sm">{cat.name}</div>
              <div className="text-xs opacity-90 mt-1 hidden sm:block">{cat.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickCategories;