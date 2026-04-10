import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ 
  title, 
  description, 
  icon, 
  price, 
  rating, 
  distance, 
  location, 
  image, 
  href, 
  badge, 
  badgeColor = 'primary',
  onClick,
  verified = false,
  featured = false,
  children 
}) => {
  const badgeColors = {
    primary: 'bg-primary-100 text-primary-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-purple-100 text-purple-700',
    red: 'bg-red-100 text-red-700',
  };

  const CardContent = () => (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border ${featured ? 'border-primary-200 ring-2 ring-primary-100' : 'border-gray-100'}`}>
      {image && (
        <div className="h-32 bg-gray-100 relative">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {featured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs px-2 py-1 rounded-full">
              ⭐ Featured
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon && <span className="text-2xl">{icon}</span>}
            <h3 className="font-semibold text-gray-800 line-clamp-1">{title}</h3>
          </div>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        )}
        
        <div className="flex flex-wrap gap-3 text-sm">
          {rating && (
            <span className="flex items-center gap-1 text-gray-600">
              ⭐ {rating}
            </span>
          )}
          {distance && (
            <span className="flex items-center gap-1 text-gray-600">
              📍 {distance} km away
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1 text-gray-600">
              📌 {location}
            </span>
          )}
          {price && (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              💰 {price}
            </span>
          )}
          {verified && (
            <span className="text-xs text-green-600">✓ Verified</span>
          )}
        </div>
        
        {children && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link to={href} onClick={onClick}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default Card;