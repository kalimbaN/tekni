const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const {
    createListing,
    getListings,
    getListingById,
    searchListings,
    getListingsByCategory,
    getNearbyListings,
    getUserListings
} = require('../controllers/listing.controller');

// Public routes
router.get('/', getListings);
router.get('/search', searchListings);
router.get('/nearby', getNearbyListings);
router.get('/category/:categorySlug', getListingsByCategory);
router.get('/:id', getListingById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createListing);
router.get('/user/my-listings', authMiddleware, getUserListings);

module.exports = router;