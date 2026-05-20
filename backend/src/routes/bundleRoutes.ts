import express from 'express';
import { getBundles, createBundle } from '../controllers/bundleController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.get('/', getBundles);
router.post('/', protect, admin, createBundle);

export default router;
