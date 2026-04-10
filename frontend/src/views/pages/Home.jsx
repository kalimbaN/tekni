import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSearch from '../components/HeroSearch';
import QuickCategories from '../components/QuickCategories';
import CategorySection from '../components/CategorySection';
import NearbyListings from '../components/NearbyListings';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Kigali');
  const [searchParams, setSearchParams] = useState(null);

  // Category data
  const serviceCategories = [
    { name: 'Plumber', icon: '🔧', href: '/services/plumber', count: 24 },
    { name: 'Electrician', icon: '⚡', href: '/services/electrician', count: 18 },
    { name: 'Masonry', icon: '🧱', href: '/services/mason', count: 12 },
    { name: 'Painter', icon: '🎨', href: '/services/painter', count: 9 },
    { name: 'Carpenter', icon: '🪚', href: '/services/carpenter', count: 7 },
    { name: 'Tailor', icon: '👔', href: '/services/tailor', count: 15 },
    { name: 'Shoe Repair', icon: '👞', href: '/services/shoe-repair', count: 6 },
    { name: 'Computer Repair', icon: '💻', href: '/services/computer-repair', count: 11 },
    { name: 'Cleaner', icon: '🧹', href: '/services/cleaner', count: 22 },
    { name: 'More Services', icon: '📋', href: '/services', count: null },
  ];

  const usedItemCategories = [
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
  ];

  const propertyCategories = [
    { name: 'Houses For Sale', icon: '🏠', href: '/properties/houses-sale' },
    { name: 'Houses For Rent', icon: '🏘️', href: '/properties/houses-rent' },
    { name: 'Apartments', icon: '🏢', href: '/properties/apartments' },
    { name: 'Land/Plots', icon: '🏗️', href: '/properties/land' },
    { name: 'Commercial Spaces', icon: '🏬', href: '/properties/commercial' },
    { name: 'Rooms For Rent', icon: '🚪', href: '/properties/rooms' },
  ];

  const tenderCategories = [
    { name: 'Open Tenders', icon: '📢', href: '/tenders/open' },
    { name: 'Construction', icon: '🏗️', href: '/tenders/construction' },
    { name: 'Supply', icon: '📦', href: '/tenders/supply' },
    { name: 'Services', icon: '🔧', href: '/tenders/services' },
    { name: 'Post a Tender', icon: '✍️', href: '/tenders/create' },
  ];

  const jobCategories = [
    { name: 'Full Time', icon: '💼', href: '/jobs/full-time' },
    { name: 'Part Time', icon: '⏰', href: '/jobs/part-time' },
    { name: 'Contract', icon: '📄', href: '/jobs/contract' },
    { name: 'Remote', icon: '🏠', href: '/jobs/remote' },
    { name: 'Post a Job', icon: '✍️', href: '/jobs/create' },
  ];

  // Simulate API call for nearby listings
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      // Simulate network delay
      setTimeout(() => {
        setListings([
          {
            id: 1,
            type: 'service',
            title: "John's Plumbing Services",
            rating: 4.8,
            reviews: 127,
            distance: 1.2,
            price: '500 RWF/hour',
            postedAt: '2 hours ago',
            verified: true,
            href: '/services/plumber/1',
            description: 'Professional plumbing services for residential and commercial properties.',
          },
          {
            id: 2,
            type: 'used_item',
            title: 'iPhone 13 Pro - 256GB',
            rating: null,
            reviews: null,
            distance: 2.5,
            price: '450,000 RWF',
            postedAt: '1 day ago',
            verified: false,
            href: '/used/phones/2',
            description: 'Excellent condition, includes charger and case. Battery health 95%.',
          },
          {
            id: 3,
            type: 'property',
            title: '2 Bedroom Apartment for Rent',
            rating: null,
            reviews: null,
            distance: 0.8,
            price: '350,000 RWF/month',
            postedAt: '3 days ago',
            verified: true,
            href: '/properties/apartments/3',
            description: 'Fully furnished, 24/7 security, parking included.',
          },
          {
            id: 4,
            type: 'tender',
            title: 'Tender: Electrician Needed for School Project',
            rating: null,
            reviews: null,
            distance: 3.7,
            price: 'Budget: 500,000 RWF',
            postedAt: '5 days ago',
            verified: false,
            href: '/tenders/open/4',
            description: 'Looking for certified electricians for school wiring project.',
          },
          {
            id: 5,
            type: 'job',
            title: 'Accountant Needed',
            rating: null,
            reviews: null,
            distance: 4.2,
            price: '400,000 - 600,000 RWF/month',
            postedAt: '1 week ago',
            verified: true,
            href: '/jobs/full-time/5',
            description: 'Seeking experienced accountant for busy firm.',
          },
          {
            id: 6,
            type: 'vehicle',
            title: 'Toyota RAV4 2019',
            rating: null,
            reviews: null,
            distance: 6.5,
            price: '32,000,000 RWF',
            postedAt: '2 days ago',
            verified: false,
            href: '/vehicles/cars/6',
            description: 'Low mileage, well maintained, one owner.',
          },
          {
            id: 7,
            type: 'land',
            title: 'Land Plot for Sale - Nyarutarama',
            rating: null,
            reviews: null,
            distance: 5.3,
            price: '85,000,000 RWF',
            postedAt: '4 days ago',
            verified: true,
            href: '/properties/land/7',
            description: 'Prime location, ready for construction.',
          },
        ]);
        setLoading(false);
      }, 1500);
    };

    fetchListings();
  }, [location]);

  const handleSearch = (params) => {
    setSearchParams(params);
    console.log('Searching with:', params);
    // TODO: Implement actual search API call
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    // TODO: Refetch listings based on new location
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSearch 
          onSearch={handleSearch} 
          onLocationChange={handleLocationChange}
          initialLocation={location}
        />
        
        <QuickCategories />
        
        <div className="bg-white">
          <CategorySection 
            title="Services" 
            icon="🔧" 
            items={serviceCategories} 
            viewAllLink="/services" 
            columns={5}
            badge="Popular"
          />
          
          <CategorySection 
            title="Used Items" 
            icon="📱" 
            items={usedItemCategories} 
            viewAllLink="/used-items" 
            columns={5}
          />
          
          <CategorySection 
            title="Properties" 
            icon="🏠" 
            items={propertyCategories} 
            viewAllLink="/properties" 
            columns={3}
          />
          
          <CategorySection 
            title="Tenders" 
            icon="📄" 
            items={tenderCategories} 
            viewAllLink="/tenders" 
            columns={4}
          />
          
          <CategorySection 
            title="Jobs" 
            icon="💼" 
            items={jobCategories} 
            viewAllLink="/jobs" 
            columns={4}
          />
        </div>
        
        <NearbyListings 
          listings={listings} 
          loading={loading} 
          location={location}
          onFilterChange={(filter) => console.log('Filter changed:', filter)}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;