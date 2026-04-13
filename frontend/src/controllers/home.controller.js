import API from '../services/api';

export const fetchCategories = async () => {
    const response = await API.get('/categories');
    return response.data;
};

export const fetchFeaturedListings = async () => {
    const response = await API.get('/listings?limit=6');
    return response.data;
};

export const fetchNearbyListings = async (latitude, longitude, radius = 10) => {
    const response = await API.get(`/listings/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
    return response.data;
};

export const searchListings = async (query, category, location) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category) params.append('category', category);
    if (location) params.append('district', location);
    
    const response = await API.get(`/listings/search?${params.toString()}`);
    return response.data;
};

export const fetchPopularServices = async () => {
    const response = await API.get('/categories/1/subcategories?limit=6');
    return response.data;
};