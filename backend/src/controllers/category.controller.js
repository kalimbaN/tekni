const db = require('../config/db');

const getMainCategories = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, slug, icon, description FROM main_categories WHERE is_active = true ORDER BY display_order'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getSubcategories = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const result = await db.query(
            `SELECT id, name, slug FROM subcategories 
             WHERE main_category_id = $1 AND is_active = true 
             ORDER BY display_order`,
            [categoryId]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getCategoryPricing = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const result = await db.query(
            `SELECT pricing_type, fee_amount, duration_days, is_optional 
             FROM category_pricing 
             WHERE main_category_id = $1 AND is_active = true`,
            [categoryId]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getMainCategories,
    getSubcategories,
    getCategoryPricing
};