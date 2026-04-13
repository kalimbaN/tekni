const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { createListing, getListings, getListingById } = require('../controllers/listing.controller');

router.post('/', authMiddleware, createListing);
router.get('/', getListings);
router.get('/:id', getListingById);

module.exports = router;