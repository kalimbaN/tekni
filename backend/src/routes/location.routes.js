import express from 'express';
import { getProvinces, getDistricts, getSectors, getVillages } from '../controllers/location.controller.js';

const router = express.Router();

router.get('/provinces', getProvinces);
router.get('/provinces/:provinceId/districts', getDistricts);
router.get('/districts/:districtId/sectors', getSectors);
router.get('/sectors/:sectorId/villages', getVillages);

export default router;