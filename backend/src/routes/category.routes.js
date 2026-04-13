const express = require('express');
const router = express.Router();
const { getMainCategories, getSubcategories, getCategoryPricing } = require('../controllers/category.controller');

router.get('/', getMainCategories);
router.get('/:categoryId/subcategories', getSubcategories);
router.get('/:categoryId/pricing', getCategoryPricing);

module.exports = router;