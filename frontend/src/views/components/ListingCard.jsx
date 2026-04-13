import React from 'react';

const ListingCard = ({ listing }) => {
    const getCategoryColor = (category) => {
        const colors = {
            'Services': 'bg-blue-100 text-blue-700',
            'Used Items': 'bg-green-100 text-green-700',
            'Properties': 'bg-purple-100 text-purple-700',
            'Tenders': 'bg-orange-100 text-orange-700',
            'Jobs': 'bg-red-100 text-red-700'
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    const formatPrice = (price) => {
        if (!price) return 'Price on request';
        return new Intl.NumberFormat('rw-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-5 cursor-pointer">
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(listing.category_name)}`}>
                    {listing.category_name}
                </span>
                {listing.is_verified && (
                    <span className="text-green-600 text-sm">✔ Verified</span>
                )}
            </div>
            
            <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
            
            {listing.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                </p>
            )}
            
            <div className="space-y-2 mb-4">
                {listing.distance && (
                    <div className="text-sm text-gray-500">
                        📍 {listing.distance} km away
                    </div>
                )}
                <div className="text-xl font-bold text-blue-600">
                    {listing.hourly_rate 
                        ? `${formatPrice(listing.price)}/hour`
                        : listing.budget_min 
                            ? `${formatPrice(listing.budget_min)} - ${formatPrice(listing.budget_max)}/month`
                            : formatPrice(listing.price)
                    }
                </div>
                <div className="text-xs text-gray-400">
                    Posted {new Date(listing.created_at).toLocaleDateString()}
                </div>
            </div>
            
            <button className="w-full mt-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
                View Details →
            </button>
        </div>
    );
};

export default ListingCard;