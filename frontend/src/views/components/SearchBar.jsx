import React from 'react';

const SearchBar = ({ 
    searchQuery, 
    setSearchQuery, 
    onSearch,
    district,
    setDistrict,
    radius,
    setRadius,
    onUseCurrentLocation
}) => {
    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={onSearch} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <input
                        type="text"
                        placeholder="e.g. plumber, electrician..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-6 py-4 text-gray-700 focus:outline-none"
                    />
                    
                    <div className="flex border-t md:border-t-0 md:border-l">
                        <select 
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="px-4 py-4 text-gray-700 focus:outline-none bg-gray-50"
                        >
                            <option value="Kigali">Kigali</option>
                            <option value="Nyarugenge">Nyarugenge</option>
                            <option value="Kicukiro">Kicukiro</option>
                            <option value="Gasabo">Gasabo</option>
                        </select>
                        
                        <select 
                            value={radius}
                            onChange={(e) => setRadius(Number(e.target.value))}
                            className="px-4 py-4 text-gray-700 focus:outline-none bg-gray-50"
                        >
                            <option value={5}>Within 5 km</option>
                            <option value={10}>Within 10 km</option>
                            <option value={20}>Within 20 km</option>
                            <option value={50}>Within 50 km</option>
                        </select>
                        
                        <button
                            type="button"
                            onClick={onUseCurrentLocation}
                            className="px-4 py-4 text-blue-600 hover:bg-blue-50 transition"
                        >
                            📍 Use my current location
                        </button>
                    </div>
                    
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 transition"
                    >
                        Search →
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchBar;