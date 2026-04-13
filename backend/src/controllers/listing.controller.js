// Add this function to get listings by category slug
const getListingsByCategorySlug = async (req, res) => {
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
                mc.name as category_name,
                mc.slug as category_slug,
                u.full_name as user_name,
                up.rating as user_rating,
                up.verification_status as user_verification,
                COALESCE(d.name, 'Kigali') as district_name
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN districts d ON l.district_id = d.id
            WHERE mc.slug = $1 AND l.status = 'active'
            ORDER BY l.created_at DESC
            LIMIT $2 OFFSET $3
        `, [categorySlug, limit, offset]);
        
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Add to module.exports
module.exports = {
    createListing,
    getListings,
    getListingById,
    searchListings,
    getListingsByCategory,
    getNearbyListings,
    getUserListings,
    getListingsByCategorySlug  // Add this
};