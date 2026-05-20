import express from 'express';
import { submitPayment, verifyPayment, getPayments, getMyPayments } from '../controllers/paymentController';
import { protect, admin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/my', protect, getMyPayments);
router.get('/', protect, admin, getPayments);
router.post('/submit', protect, upload.single('screenshot'), submitPayment);
router.put('/verify', protect, admin, verifyPayment);

export default router;
