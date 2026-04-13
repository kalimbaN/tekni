import express from 'express';
import { getMainCategories, getSubcategories, getCategoryPricing } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', getMainCategories);
router.get('/:categoryId/subcategories', getSubcategories);
router.get('/:categoryId/pricing', getCategoryPricing);

export default router;