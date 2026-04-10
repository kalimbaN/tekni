import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NearbyListings = ({ listings, loading, location, onFilterChange }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('distance');

  const getListingIcon = (type) => {
    const icons = {
      service: '🔧',
      used_item: '📱',
      property: '🏠',
      tender: '📄',
      job: '💼',
      vehicle: '🚗',
      land: '🏗️',
    };
    return icons[type] || '📌';
  };

  const getListingBadge = (type) => {
    const badges = {
      service: 'bg-blue-100 text-blue-700',
      used_item: 'bg-green-100 text-green-700',
      property: 'bg-purple-100 text-purple-700',
      tender: 'bg-orange-100 text-orange-700',
      job: 'bg-teal-100 text-teal-700',
      vehicle: 'bg-red-100 text-red-700',
      land: 'bg-amber-100 text-amber-700',
    };
    return badges[type] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type) => {
    const labels = {
      service: 'Service Provider',
      used_item: 'Used Item',
      property: 'Property',
      tender: 'Tender',
      job: 'Job',
      vehicle: 'Vehicle',
      land: 'Land Plot',
    };
    return labels[type] || 'Listing';
  };

  const filteredListings = listings.filter(listing => 
    filterType === 'all' || listing.type === filterType
  );

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'distance') return a.distance - b.distance;
    if (sortBy === 'price_asc') return (a.price_num || 0) - (b.price_num || 0);
    if (sortBy === 'price_desc') return (b.price_num || 0) - (a.price_num || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'service', label: '🔧 Services' },
    { value: 'used_item', label: '📱 Used Items' },
    { value: 'property', label: '🏠 Properties' },
    { value: 'tender', label: '📄 Tenders' },
    { value: 'job', label: '💼 Jobs' },
  ];

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Finding listings near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Near you in {typeof location === 'object' ? location.name : location}</h2>
            <p className="text-gray-500 text-sm mt-1">Based on your location preference</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                onFilterChange?.(e.target.value);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="distance">Sort by: Distance</option>
              <option value="rating">Sort by: Rating</option>
              <option value="price_asc">Sort by: Price (Low to High)</option>
              <option value="price_desc">Sort by: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {sortedListings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-500">No listings found in this area. Try expanding your search radius.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedListings.map((listing, idx) => (
              <Link
                key={idx}
                to={listing.href || `/${listing.type}/${listing.id}`}
                className="block bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 hover:border-primary-200"
              >
                <div className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="text-3xl">{getListingIcon(listing.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 truncate">{listing.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getListingBadge(listing.type)}`}>
                            {getTypeLabel(listing.type)}
                          </span>
                          {listing.verified && (
                            <span className="text-xs text-green-600">✓ Verified</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          {listing.rating && (
                            <span className="flex items-center gap-1">
                              ⭐ {listing.rating} ({listing.reviews || 0} reviews)
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            📍 {listing.distance} km away
                          </span>
                          {listing.price && (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              💰 {listing.price}
                            </span>
                          )}
                          {listing.postedAt && (
                            <span className="text-xs">Posted {listing.postedAt}</span>
                          )}
                        </div>
                        {listing.description && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-1">{listing.description}</p>
                        )}
                      </div>
                    </div>
                    <button className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-sm hover:bg-primary-100 transition whitespace-nowrap">
                      View Details →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {sortedListings.length >= 5 && (
          <div className="text-center mt-8">
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Load more listings →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyListings;