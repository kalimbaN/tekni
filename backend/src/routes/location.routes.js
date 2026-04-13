const express = require('express');
const router = express.Router();
const { getProvinces, getDistricts, getSectors, getVillages } = require('../controllers/location.controller');

router.get('/provinces', getProvinces);
router.get('/provinces/:provinceId/districts', getDistricts);
router.get('/districts/:districtId/sectors', getSectors);
router.get('/sectors/:sectorId/villages', getVillages);

module.exports = router;