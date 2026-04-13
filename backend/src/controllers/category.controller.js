const db = require('../config/db');

const getMainCategories = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, slug, icon, description, is_featured FROM main_categories WHERE is_active = true ORDER BY display_order'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getSubcategories = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const result = await db.query(
            `SELECT id, name, slug, icon FROM subcategories 
             WHERE main_category_id = $1 AND is_active = true 
             ORDER BY display_order`,
            [categoryId]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get subcategories error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getCategoryBySlug = async (req, res) => {
    const { slug } = req.params;
    try {
        const result = await db.query(
            `SELECT id, name, slug, icon, description FROM main_categories 
             WHERE slug = $1 AND is_active = true`,
            [slug]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Get category by slug error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getListingsByCategory = async (req, res) => {
    const { categorySlug } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    try {
        const result = await db.query(`
            SELECT 
                l.id,
                l.title,
                l.description,
                l.price,
                l.budget_min,
                l.budget_max,
                l.images,
                l.created_at,
                l.view_count,
                mc.name as category_name,
                mc.slug as category_slug,
                u.full_name as user_name,
                u.id as user_id,
                up.rating as user_rating,
                up.verification_status as user_verification,
                COALESCE(d.name, 'Kigali') as district_name,
                CASE 
                    WHEN l.price IS NOT NULL THEN l.price
                    WHEN l.budget_min IS NOT NULL THEN l.budget_min
                    ELSE 0
                END as sort_price
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN districts d ON l.district_id = d.id
            WHERE mc.slug = $1 AND l.status = 'active'
            ORDER BY l.created_at DESC
            LIMIT $2 OFFSET $3
        `, [categorySlug, limit, offset]);
        
        // Get total count
        const countResult = await db.query(`
            SELECT COUNT(*) 
            FROM listings l
            JOIN main_categories mc ON l.main_category_id = mc.id
            WHERE mc.slug = $1 AND l.status = 'active'
        `, [categorySlug]);
        
        const listings = result.rows.map(listing => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            budget_min: listing.budget_min,
            budget_max: listing.budget_max,
            images: listing.images || [],
            created_at: listing.created_at,
            category_name: listing.category_name,
            user_name: listing.user_name,
            user_id: listing.user_id,
            user_rating: listing.user_rating,
            is_verified: listing.user_verification === 'verified',
            location: listing.district_name,
            distance: (Math.random() * 10).toFixed(1) // You can calculate real distance with coordinates
        }));
        
        res.json({
            success: true,
            data: listings,
            pagination: {
                total: parseInt(countResult.rows[0].count),
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        console.error('Get listings by category error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getMainCategories,
    getSubcategories,
    getCategoryBySlug,
    getListingsByCategory
};