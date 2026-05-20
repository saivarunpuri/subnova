import express from 'express';
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getPacks,
  getPackById,
  createPack,
  updatePack,
  deletePack
} from '../controllers/ottController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

// Brand routes
router.get('/brands', getBrands);
router.post('/brands', protect, admin, createBrand);
router.put('/brands/:id', protect, admin, updateBrand);
router.delete('/brands/:id', protect, admin, deleteBrand);

// Pack routes
router.get('/packs', getPacks);
router.get('/packs/:id', getPackById);
router.post('/packs', protect, admin, createPack);
router.put('/packs/:id', protect, admin, updatePack);
router.delete('/packs/:id', protect, admin, deletePack);

export default router;
