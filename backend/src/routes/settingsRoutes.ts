import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect, admin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protect, admin, upload.single('qrCode'), updateSettings);

export default router;
