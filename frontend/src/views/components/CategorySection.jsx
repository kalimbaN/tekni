import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = ({ title, icon, items, viewAllLink, columns = 5, badge }) => {
  return (
    <div className="py-8 border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
            {badge && (
              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">{badge}</span>
            )}
          </div>
          <Link to={viewAllLink} className="text-secondary-600 hover:text-secondary-700 text-sm font-medium flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </div>
        
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(columns, 5)} gap-3`}>
          {items.map((item, idx) => (
            <Link
              key={idx}
              to={item.href}
              className="group bg-white hover:bg-primary-50 rounded-lg px-4 py-3 text-center transition-all duration-200 border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow"
            >
              {item.icon && <span className="text-xl mr-2">{item.icon}</span>}
              <span className="text-gray-700 group-hover:text-primary-600 font-medium">{item.name}</span>
              {item.count && (
                <span className="text-xs text-gray-400 ml-1">({item.count})</span>
              )}
              {item.price && (
                <div className="text-xs text-green-600 mt-1">{item.price}</div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;