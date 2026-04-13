const express = require('express');
const router = express.Router();
const { 
    getMainCategories, 
    getSubcategories, 
    getCategoryBySlug,
    getListingsByCategory 
} = require('../controllers/category.controller');

router.get('/', getMainCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:slug/listings', getListingsByCategory);
router.get('/:categoryId/subcategories', getSubcategories);

module.exports = router;