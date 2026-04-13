import { useState, useEffect } from 'react';
import API from '../services/api';

export const useFeaturedListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        try {
            setLoading(true);
            // Use your existing API endpoint structure
            const response = await API.get('/listings?limit=6');
            setListings(response.data.data || []);
        } catch (err) {
            setError(err.message);
            // Fallback to mock data if API not ready
            setListings(getMockListings());
        } finally {
            setLoading(false);
        }
    };

    return { listings, loading, error, refetch: loadListings };
};

export const useNearbyListings = (latitude, longitude) => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (latitude && longitude) {
            loadNearby();
        } else {
            // Load default listings
            loadNearby();
        }
    }, [latitude, longitude]);

    const loadNearby = async () => {
        try {
            setLoading(true);
            const response = await API.get('/listings?limit=7');
            setListings(response.data.data || getMockListings());
        } catch (err) {
            console.error(err);
            setListings(getMockListings());
        } finally {
            setLoading(false);
        }
    };

    return { listings, loading };
};

export const useSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async (query, category, location) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (query) params.append('q', query);
            if (category) params.append('category', category);
            if (location) params.append('district', location);
            
            const response = await API.get(`/listings?${params.toString()}`);
            setResults(response.data.data || []);
        } catch (err) {
            console.error(err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return { results, loading, search };
};

// Mock data fallback (matching your existing mock data structure)
const getMockListings = () => [
    {
        id: 1,
        category_name: 'Services',
        title: "John's Plumbing Services",
        description: 'Professional plumbing services for residential and commercial properties.',
        price: 500,
        hourly_rate: true,
        distance: 1.2,
        rating: 4.8,
        reviews: 127,
        is_verified: true,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        category_name: 'Used Items',
        title: 'iPhone 13 Pro - 256GB',
        description: 'Excellent condition, includes charger and case. Battery health 95%.',
        price: 450000,
        distance: 2.5,
        is_verified: false,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        category_name: 'Properties',
        title: '2 Bedroom Apartment for Rent',
        description: 'Fully furnished, 24/7 security, parking included.',
        price: 350000,
        distance: 0.8,
        is_verified: true,
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        category_name: 'Tenders',
        title: 'Tender: Electrician Needed for School Project',
        description: 'Looking for certified electricians for school wiring project.',
        budget_min: 500000,
        distance: 3.7,
        is_verified: false,
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 5,
        category_name: 'Jobs',
        title: 'Accountant Needed',
        description: 'Seeking experienced accountant for busy firm.',
        budget_min: 400000,
        budget_max: 600000,
        distance: 4.2,
        is_verified: true,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
];