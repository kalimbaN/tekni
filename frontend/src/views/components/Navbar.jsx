import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dropdowns = {
    services: {
      title: 'Services',
      items: [
        { name: 'Plumber', icon: '🔧', href: '/services/plumber' },
        { name: 'Electrician', icon: '⚡', href: '/services/electrician' },
        { name: 'Masonry', icon: '🧱', href: '/services/mason' },
        { name: 'Painter', icon: '🎨', href: '/services/painter' },
        { name: 'Carpenter', icon: '🪚', href: '/services/carpenter' },
        { name: 'Tailor', icon: '👔', href: '/services/tailor' },
        { name: 'Shoe Repair', icon: '👞', href: '/services/shoe-repair' },
        { name: 'Computer Repair', icon: '💻', href: '/services/computer-repair' },
        { name: 'Cleaner', icon: '🧹', href: '/services/cleaner' },
        { name: 'All Services', icon: '📋', href: '/services' },
      ],
    },
    usedItems: {
      title: 'Used Items',
      items: [
        { name: 'Electronics', icon: '📱', href: '/used/electronics' },
        { name: 'Furniture', icon: '🛋️', href: '/used/furniture' },
        { name: 'Clothing', icon: '👕', href: '/used/clothing' },
        { name: 'Phones', icon: '📞', href: '/used/phones' },
        { name: 'Cars', icon: '🚗', href: '/used/cars' },
        { name: 'Motorcycles', icon: '🏍️', href: '/used/motorcycles' },
        { name: 'Bikes', icon: '🚲', href: '/used/bikes' },
        { name: 'Books', icon: '📚', href: '/used/books' },
        { name: 'Appliances', icon: '🔌', href: '/used/appliances' },
        { name: 'All Items', icon: '📋', href: '/used-items' },
      ],
    },
    properties: {
      title: 'Properties',
      items: [
        { name: 'Houses for Sale', icon: '🏠', href: '/properties/houses-sale' },
        { name: 'Houses for Rent', icon: '🏘️', href: '/properties/houses-rent' },
        { name: 'Apartments', icon: '🏢', href: '/properties/apartments' },
        { name: 'Land/Plots for Sale', icon: '🏗️', href: '/properties/land' },
        { name: 'Commercial Spaces', icon: '🏬', href: '/properties/commercial' },
        { name: 'Rooms for Rent', icon: '🚪', href: '/properties/rooms' },
        { name: 'All Properties', icon: '📋', href: '/properties' },
      ],
    },
    tenders: {
      title: 'Tenders',
      items: [
        { name: 'Open Tenders', icon: '📢', href: '/tenders/open' },
        { name: 'Construction', icon: '🏗️', href: '/tenders/construction' },
        { name: 'Supply', icon: '📦', href: '/tenders/supply' },
        { name: 'Services', icon: '🔧', href: '/tenders/services' },
        { name: 'Post a Tender', icon: '✍️', href: '/tenders/create' },
        { name: 'All Tenders', icon: '📋', href: '/tenders' },
      ],
    },
    jobs: {
      title: 'Jobs',
      items: [
        { name: 'Full Time', icon: '💼', href: '/jobs/full-time' },
        { name: 'Part Time', icon: '⏰', href: '/jobs/part-time' },
        { name: 'Contract', icon: '📄', href: '/jobs/contract' },
        { name: 'Remote', icon: '🏠', href: '/jobs/remote' },
        { name: 'Post a Job', icon: '✍️', href: '/jobs/create' },
        { name: 'All Jobs', icon: '📋', href: '/jobs' },
      ],
    },
  };

  const DropdownMenu = ({ dropdown, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div 
        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
        onMouseLeave={onClose}
      >
        <div className="grid grid-cols-2 gap-1 p-2">
          {dropdown.items.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md transition"
              onClick={onClose}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
                Tekni
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {Object.entries(dropdowns).map(([key, dropdown]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setOpenDropdown(key)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium rounded-md hover:bg-gray-50 transition">
                  {dropdown.title} <span className="text-xs">▼</span>
                </button>
                <DropdownMenu dropdown={dropdown} isOpen={openDropdown === key} onClose={() => setOpenDropdown(null)} />
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2">Login</Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-700 hover:text-primary">
                    <div className="w-8 h-8 bg-mint rounded-full flex items-center justify-center text-primary">
                    {user?.full_name?.charAt(0) || 'U'}
                    </div>
                </button>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 text-sm">
                    Logout
                </button>
            </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4">
          {Object.entries(dropdowns).map(([key, dropdown]) => (
            <div key={key} className="mb-3">
              <div className="font-semibold text-gray-800 mb-2">{dropdown.title}</div>
              <div className="grid grid-cols-2 gap-2 pl-2">
                {dropdown.items.slice(0, 6).map((item, idx) => (
                  <Link key={idx} to={item.href} className="text-sm text-gray-600 py-1" onClick={() => setMobileMenuOpen(false)}>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t pt-3 mt-2 flex gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="flex-1 text-center text-gray-600">Login</Link>
                <Link to="/register" className="flex-1 text-center bg-primary-600 text-white py-2 rounded-lg">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="w-full text-center text-red-600 py-2">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;