const db = require('../config/db');

// Get all listings with filters
const getListings = async (req, res) => {
    const { 
        limit = 20, 
        offset = 0, 
        category, 
        status = 'active',
        sort = 'newest'
    } = req.query;
    
    try {
        let query = `
            SELECT 
                l.id,
                l.user_id,
                l.title,
                l.description,
                l.price,
                l.budget_min,
                l.budget_max,
                l.images,
                l.status,
                l.view_count,
                l.created_at,
                l.assigned_to,
                l.completed_at,
                mc.id as category_id,
                mc.name as category_name,
                mc.slug as category_slug,
                sc.id as subcategory_id,
                sc.name as subcategory_name,
                sc.slug as subcategory_slug,
                u.full_name as user_name,
                u.phone as user_phone,
                u.email as user_email,
                up.rating as user_rating,
                up.verification_status as user_verification,
                COALESCE(p.name, 'Kigali') as province_name,
                COALESCE(d.name, 'Nyarugenge') as district_name
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            LEFT JOIN subcategories sc ON l.subcategory_id = sc.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN provinces p ON l.province_id = p.id
            LEFT JOIN districts d ON l.district_id = d.id
            WHERE l.status = $1
        `;
        
        const queryParams = [status];
        let paramCount = 2;
        
        // Add category filter
        if (category) {
            query += ` AND mc.slug = $${paramCount}`;
            queryParams.push(category);
            paramCount++;
        }
        
        // Add sorting
        if (sort === 'newest') {
            query += ` ORDER BY l.created_at DESC`;
        } else if (sort === 'oldest') {
            query += ` ORDER BY l.created_at ASC`;
        } else if (sort === 'price_low') {
            query += ` ORDER BY COALESCE(l.price, l.budget_min, 0) ASC`;
        } else if (sort === 'price_high') {
            query += ` ORDER BY COALESCE(l.price, l.budget_min, 0) DESC`;
        }
        
        // Add pagination
        query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        queryParams.push(limit, offset);
        
        const result = await db.query(query, queryParams);
        
        // Get total count for pagination
        const countResult = await db.query(
            `SELECT COUNT(*) FROM listings WHERE status = $1`,
            [status]
        );
        
        // Transform listings for frontend
        const listings = result.rows.map(listing => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            budget_min: listing.budget_min,
            budget_max: listing.budget_max,
            images: listing.images || [],
            created_at: listing.created_at,
            distance: listing.distance || (Math.random() * 10).toFixed(1),
            category_name: listing.category_name,
            category_slug: listing.category_slug,
            subcategory_name: listing.subcategory_name,
            user_name: listing.user_name,
            user_rating: listing.user_rating,
            is_verified: listing.user_verification === 'verified',
            location: `${listing.district_name}, ${listing.province_name}`
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
        console.error('Get listings error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Search listings
const searchListings = async (req, res) => {
    const { q, category, district, min_price, max_price, limit = 20 } = req.query;
    
    try {
        let query = `
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
                u.phone as user_phone,
                up.rating as user_rating,
                up.verification_status as user_verification,
                d.name as district_name
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN districts d ON l.district_id = d.id
            WHERE l.status = 'active'
        `;
        
        const queryParams = [];
        let paramCount = 1;
        
        // Full-text search on title and description
        if (q) {
            query += ` AND (l.title ILIKE $${paramCount} OR l.description ILIKE $${paramCount})`;
            queryParams.push(`%${q}%`);
            paramCount++;
        }
        
        // Category filter
        if (category) {
            query += ` AND mc.slug = $${paramCount}`;
            queryParams.push(category);
            paramCount++;
        }
        
        // District filter
        if (district) {
            query += ` AND d.name ILIKE $${paramCount}`;
            queryParams.push(`%${district}%`);
            paramCount++;
        }
        
        // Price range filters
        if (min_price) {
            query += ` AND (COALESCE(l.price, l.budget_min, 0) >= $${paramCount})`;
            queryParams.push(min_price);
            paramCount++;
        }
        
        if (max_price) {
            query += ` AND (COALESCE(l.price, l.budget_min, 0) <= $${paramCount})`;
            queryParams.push(max_price);
            paramCount++;
        }
        
        query += ` ORDER BY l.created_at DESC LIMIT $${paramCount}`;
        queryParams.push(limit);
        
        const result = await db.query(query, queryParams);
        
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
            is_verified: listing.user_verification === 'verified',
            location: listing.district_name
        }));
        
        res.json({
            success: true,
            data: listings,
            search_params: { q, category, district, min_price, max_price }
        });
    } catch (error) {
        console.error('Search listings error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get listing by ID
const getListingById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await db.query(`
            SELECT 
                l.*,
                mc.id as category_id,
                mc.name as category_name,
                mc.slug as category_slug,
                sc.id as subcategory_id,
                sc.name as subcategory_name,
                sc.slug as subcategory_slug,
                u.id as user_id,
                u.full_name as user_name,
                u.email as user_email,
                u.phone as user_phone,
                u.user_type as user_type,
                up.bio as user_bio,
                up.rating as user_rating,
                up.total_transactions as user_total_transactions,
                up.verification_status as user_verification,
                up.avatar_url as user_avatar,
                p.name as province_name,
                d.name as district_name,
                s.name as sector_name,
                v.name as village_name
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            LEFT JOIN subcategories sc ON l.subcategory_id = sc.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN provinces p ON l.province_id = p.id
            LEFT JOIN districts d ON l.district_id = d.id
            LEFT JOIN sectors s ON l.sector_id = s.id
            LEFT JOIN villages v ON l.village_id = v.id
            WHERE l.id = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Listing not found' });
        }
        
        const listing = result.rows[0];
        
        // Increment view count
        await db.query('UPDATE listings SET view_count = view_count + 1 WHERE id = $1', [id]);
        
        // Get similar listings
        const similarResult = await db.query(`
            SELECT id, title, price, images, created_at
            FROM listings
            WHERE main_category_id = $1 AND id != $2 AND status = 'active'
            LIMIT 5
        `, [listing.category_id, id]);
        
        res.json({
            success: true,
            data: {
                id: listing.id,
                title: listing.title,
                description: listing.description,
                images: listing.images || [],
                price: listing.price,
                budget_min: listing.budget_min,
                budget_max: listing.budget_max,
                negotiable: listing.negotiable,
                status: listing.status,
                view_count: listing.view_count + 1,
                created_at: listing.created_at,
                expires_at: listing.expires_at,
                category: {
                    id: listing.category_id,
                    name: listing.category_name,
                    slug: listing.category_slug
                },
                subcategory: listing.subcategory_id ? {
                    id: listing.subcategory_id,
                    name: listing.subcategory_name,
                    slug: listing.subcategory_slug
                } : null,
                location: {
                    province: listing.province_name,
                    district: listing.district_name,
                    sector: listing.sector_name,
                    village: listing.village_name,
                    details: listing.location_details
                },
                user: {
                    id: listing.user_id,
                    name: listing.user_name,
                    email: listing.user_email,
                    phone: listing.user_phone,
                    type: listing.user_type,
                    bio: listing.user_bio,
                    rating: listing.user_rating,
                    total_transactions: listing.user_total_transactions,
                    is_verified: listing.user_verification === 'verified',
                    avatar: listing.user_avatar
                },
                similar_listings: similarResult.rows.map(s => ({
                    id: s.id,
                    title: s.title,
                    price: s.price,
                    image: s.images?.[0],
                    created_at: s.created_at
                }))
            }
        });
    } catch (error) {
        console.error('Get listing error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get listings by category
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
                mc.name as category_name,
                u.full_name as user_name,
                up.rating as user_rating,
                up.verification_status as user_verification
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            WHERE mc.slug = $1 AND l.status = 'active'
            ORDER BY l.created_at DESC
            LIMIT $2 OFFSET $3
        `, [categorySlug, limit, offset]);
        
        res.json({
            success: true,
            data: result.rows,
            category: categorySlug
        });
    } catch (error) {
        console.error('Get listings by category error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get nearby listings based on coordinates
const getNearbyListings = async (req, res) => {
    const { lat, lng, radius = 10, limit = 20 } = req.query;
    
    try {
        let query = `
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
                u.full_name as user_name,
                up.rating as user_rating,
                up.verification_status as user_verification,
                d.name as district_name
            FROM listings l
            JOIN users u ON l.user_id = u.id
            JOIN main_categories mc ON l.main_category_id = mc.id
            LEFT JOIN user_profiles up ON u.id = up.user_id
            LEFT JOIN districts d ON l.district_id = d.id
            WHERE l.status = 'active'
        `;
        
        const queryParams = [];
        
        // If coordinates provided, calculate distance
        if (lat && lng) {
            query += ` AND l.latitude IS NOT NULL AND l.longitude IS NOT NULL`;
            query += ` ORDER BY (6371 * acos(cos(radians($1)) * cos(radians(l.latitude)) * cos(radians(l.longitude) - radians($2)) + sin(radians($1)) * sin(radians(l.latitude)))) ASC`;
            queryParams.push(lat, lng);
        } else {
            query += ` ORDER BY l.created_at DESC`;
        }
        
        query += ` LIMIT $${queryParams.length + 1}`;
        queryParams.push(limit);
        
        const result = await db.query(query, queryParams);
        
        res.json({
            success: true,
            data: result.rows,
            location: { lat, lng, radius }
        });
    } catch (error) {
        console.error('Get nearby listings error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new listing
const createListing = async (req, res) => {
    const {
        category_id,
        subcategory_id,
        title,
        description,
        price,
        budget_min,
        budget_max,
        province_id,
        district_id,
        sector_id,
        village_id,
        location_details,
        images,
        duration_days = 30,
        negotiable = false
    } = req.body;
    
    const userId = req.user.id;
    
    try {
        // Validate required fields
        if (!category_id || !title || !description) {
            return res.status(400).json({ 
                success: false, 
                error: 'Category, title, and description are required' 
            });
        }
        
        // Get default duration from category rules
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
                price, budget_min, budget_max, province_id, district_id, 
                sector_id, village_id, location_details, images, 
                duration_days, expires_at, negotiable, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'active')
            RETURNING id, title, created_at
        `, [
            userId, category_id, subcategory_id, title, description,
            price, budget_min, budget_max, province_id, district_id,
            sector_id, village_id, location_details, images || [],
            finalDuration, expiresAt, negotiable
        ]);
        
        res.json({
            success: true,
            message: 'Listing created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Create listing error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get user's own listings
const getUserListings = async (req, res) => {
    const userId = req.user.id;
    const { status, limit = 20 } = req.query;
    
    try {
        let query = `
            SELECT 
                l.id,
                l.title,
                l.description,
                l.price,
                l.status,
                l.view_count,
                l.created_at,
                l.expires_at,
                mc.name as category_name
            FROM listings l
            JOIN main_categories mc ON l.main_category_id = mc.id
            WHERE l.user_id = $1
        `;
        
        const queryParams = [userId];
        
        if (status) {
            query += ` AND l.status = $2`;
            queryParams.push(status);
        }
        
        query += ` ORDER BY l.created_at DESC LIMIT $${queryParams.length + 1}`;
        queryParams.push(limit);
        
        const result = await db.query(query, queryParams);
        
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Get user listings error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createListing,
    getListings,
    getListingById,
    searchListings,
    getListingsByCategory,
    getNearbyListings,
    getUserListings
};