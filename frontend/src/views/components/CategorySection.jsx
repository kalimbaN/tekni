import React from 'react';

const CategorySection = ({ title, icon, items, viewAllLink, columns = 5, badge, loading = false }) => {
  // Loading state
  if (loading) {
    return (
      <div className="category-section py-8 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>{icon}</span> {title}
            </h2>
            <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4`}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No items state
  if (!items || items.length === 0) {
    return null;
  }

  // Determine grid columns class
  const getGridCols = () => {
    if (columns === 5) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
    if (columns === 4) return 'grid-cols-2 md:grid-cols-4';
    if (columns === 3) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
  };

  return (
    <div className="category-section py-8 border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span>{icon}</span> {title}
            {badge && (
              <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                {badge}
              </span>
            )}
          </h2>
          {viewAllLink && (
            <a href={viewAllLink} className="text-blue-600 hover:underline text-sm">
              View All →
            </a>
          )}
        </div>

        {/* Categories Grid */}
        <div className={`grid ${getGridCols()} gap-4`}>
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition">
                {item.icon}
              </div>
              <div className="font-medium text-gray-800 text-sm">
                {item.name}
              </div>
              {item.count && (
                <div className="text-xs text-gray-500 mt-1">
                  ({item.count})
                </div>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;