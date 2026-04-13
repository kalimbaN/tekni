const db = require('../config/db');

const createListing = async (req, res) => {
    const {
        category_id,
        subcategory_id,
        title,
        description,
        price,
        province_id,
        district_id,
        sector_id,
        village_id,
        budget_min,
        budget_max,
        duration_days = 30
    } = req.body;
    
    const userId = req.user.id;
    
    try {
        // Get category rules for duration
        const rules = await db.query(
            'SELECT default_duration_days FROM category_rules WHERE main_category_id = $1 LIMIT 1',
            [category_id]
        );
        
        const finalDuration = duration_days || rules.rows[0]?.default_duration_days || 30;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + finalDuration);
        
        // Create listing
        const result = await db.query(`
            INSERT INTO listings (
                user_id, main_category_id, subcategory_id, title, description,
                price, province_id, district_id, sector_id, village_id,
                budget_min, budget_max, duration_days, expires_at, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'active')
            RETURNING *
        `, [userId, category_id, subcategory_id, title, description, price,
            province_id, district_id, sector_id, village_id, budget_min, budget_max,
            finalDuration, expiresAt]);
        
        res.json({
            success: true,
            message: 'Listing created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getListings = async (req, res) => {
    const { category, status, limit = 20, offset = 0 } = req.query;
    
    try {
        let query = `
            SELECT l.*, u.full_name as user_name, mc.name as category_name
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            WHERE l.status = 'active'
        `;
        const params = [];
        
        if (category) {
            params.push(category);
            query += ` AND mc.slug = $${params.length}`;
        }
        
        if (status) {
            params.push(status);
            query += ` AND l.status = $${params.length}`;
        }
        
        query += ` ORDER BY l.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
        
        const result = await db.query(query, params);
        
        res.json({
            success: true,
            data: result.rows,
            pagination: { limit, offset }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getListingById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query(`
            SELECT l.*, u.full_name as user_name, u.email, u.phone,
                   mc.name as category_name, mc.icon
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            WHERE l.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Listing not found' });
        }
        
        // Increment view count
        await db.query('UPDATE listings SET view_count = view_count + 1 WHERE id = $1', [id]);
        
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createListing,
    getListings,
    getListingById
};