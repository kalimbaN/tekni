import { useState, useEffect } from 'react';
import API from '../services/api';

export const useLocation = () => {
    const [location, setLocation] = useState(null);
    const [district, setDistrict] = useState('Kigali');
    const [radius, setRadius] = useState(10);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        loadProvinces();
        getUserLocation();
    }, []);

    const loadProvinces = async () => {
        try {
            const response = await API.get('/locations/provinces');
            setProvinces(response.data.data || []);
        } catch (error) {
            console.error('Failed to load provinces:', error);
        }
    };

    const loadDistricts = async (provinceId) => {
        try {
            const response = await API.get(`/locations/provinces/${provinceId}/districts`);
            setDistricts(response.data.data || []);
        } catch (error) {
            console.error('Failed to load districts:', error);
        }
    };

    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Location denied:', error);
                }
            );
        }
    };

    return {
        location,
        district,
        setDistrict,
        radius,
        setRadius,
        provinces,
        districts,
        loadDistricts,
        getUserLocation
    };
};