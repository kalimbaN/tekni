const db = require('../config/db');

const getProvinces = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, name, name_fr, code FROM provinces WHERE is_active = true ORDER BY name'
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDistricts = async (req, res) => {
    const { provinceId } = req.params;
    try {
        const result = await db.query(
            'SELECT id, name, name_fr, code FROM districts WHERE province_id = $1 AND is_active = true ORDER BY name',
            [provinceId]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSectors = async (req, res) => {
    const { districtId } = req.params;
    try {
        const result = await db.query(
            'SELECT id, name, name_fr FROM sectors WHERE district_id = $1 AND is_active = true ORDER BY name',
            [districtId]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVillages = async (req, res) => {
    const { sectorId } = req.params;
    try {
        const result = await db.query(
            'SELECT id, name, name_fr FROM villages WHERE sector_id = $1 AND is_active = true ORDER BY name',
            [sectorId]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProvinces,
    getDistricts,
    getSectors,
    getVillages
};