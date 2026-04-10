import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSearch = ({ onSearch, onLocationChange, initialLocation = 'Kigali' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(initialLocation);
  const [radius, setRadius] = useState(10);
  const [category, setCategory] = useState('all');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'services', label: '🔧 Services' },
    { value: 'used_items', label: '📱 Used Items' },
    { value: 'properties', label: '🏠 Properties' },
    { value: 'tenders', label: '📄 Tenders' },
    { value: 'jobs', label: '💼 Jobs' },
  ];

  const rwandanDistricts = [
    'Kigali', 'Musanze', 'Huye', 'Rubavu', 'Rwamagana', 'Muhanga', 'Nyagatare',
    'Gicumbi', 'Rusizi', 'Nyamagabe', 'Burera', 'Gatsibo', 'Kayonza', 'Ngoma',
    'Kirehe', 'Rutsiro', 'Karongi', 'Ngororero', 'Nyabihu', 'Rulindo', 'Gakenke',
    'Kamonyi', 'Ruhango', 'Nyanza', 'Gisagara', 'Bugesera', 'Nyaruguru'
  ];

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUseCurrentLocation(true);
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          onLocationChange({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Current Location'
          });
        },
        (error) => {
          setLocationError('Unable to get your location. Please enter manually.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      query: searchQuery,
      location,
      radius,
      category,
      useCurrentLocation
    });
  };

  return (
    // Changed from gradient to white background
    <div className="bg-mint py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Title - darker text for white background */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Find skilled technicians near you
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Verified plumbers, electricians, masons & more — available in Kigali today.
        </p>

        {/* Main Search Bar - with blue button */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="e.g. plumber, electrician..."
            className="flex-1 px-5 py-3 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 px-8 py-3 text-white font-medium rounded-lg transition-colors"
          >
            Search →
          </button>
        </form>

        {/* Location Controls - lighter styling */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          {/* Category Filter */}
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-700">
            <span>🔍</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent border-none focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-700">
            <span>📍</span>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setUseCurrentLocation(false);
                onLocationChange({ name: e.target.value });
              }}
              className="bg-transparent border-none focus:outline-none"
            >
              {rwandanDistricts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Radius Filter */}
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-700">
            <span>📡</span>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="bg-transparent border-none focus:outline-none"
            >
              <option value={1}>Within 1 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={25}>Within 25 km</option>
              <option value={50}>Within 50 km</option>
              <option value={100}>Whole country</option>
            </select>
          </div>

          {/* Current Location Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="bg-gray-100 rounded-lg px-4 py-2 hover:bg-gray-200 transition flex items-center gap-2 text-gray-700"
          >
            📍 Use my current location
          </button>
        </div>

        {locationError && (
          <p className="text-red-500 text-sm text-center mt-3">{locationError}</p>
        )}
      </div>
    </div>
  );
};

export default HeroSearch;