import { Request, Response } from 'express';
import Payment from '../models/Payment';
import User from '../models/User';
import Coupon from '../models/Coupon';
import Pack from '../models/Pack';
import { AuthRequest } from '../middleware/auth';
import { notifyAdminOfPayment, sendUserOTTCredentials } from '../services/emailService';
import { uploadToImageKit } from '../services/imagekitService';

// Note: Cloudinary should be configured with env vars in index.ts or config/cloudinary.ts

export const submitPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bundleId, transactionId, amount, bundleTitle, couponCode } = req.body;
    
    if (!req.file) {
      res.status(400).json({ message: 'Screenshot is required' });
      return;
    }

    // Upload the in-memory buffer to ImageKit
    const screenshotUrl = await uploadToImageKit(req.file.buffer, req.file.originalname);


    let finalAmount = Number(amount);
    let discountAmount = 0;

    if (couponCode) {
      const cleanCouponCode = couponCode.toUpperCase().trim();
      const coupon = await Coupon.findOne({ code: cleanCouponCode, isActive: true });
      if (!coupon) {
        res.status(400).json({ message: 'Invalid or inactive coupon code' });
        return;
      }

      // Check expiry
      if (new Date(coupon.expiryDate) < new Date()) {
        res.status(400).json({ message: 'This coupon has expired' });
        return;
      }

      // Check if user has already used this coupon (Pending or Approved payment)
      const existingPayment = await Payment.findOne({
        userId: req.user._id,
        couponCode: cleanCouponCode,
        status: { $in: ['Pending', 'Approved'] }
      });
      if (existingPayment) {
        res.status(400).json({ message: 'You have already used this coupon code' });
        return;
      }

      // Calculate discount dynamically based on pack price
      const pack = await Pack.findById(bundleId);
      if (pack) {
        const originalPrice = pack.price;
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((originalPrice * coupon.discountValue) / 100);
        } else {
          discountAmount = coupon.discountValue;
        }
        discountAmount = Math.min(discountAmount, originalPrice);
        finalAmount = Math.max(0, originalPrice - discountAmount);
      }
    }

    const payment = new Payment({
      userId: req.user._id,
      bundleId,
      bundleTitle: bundleTitle || '',
      screenshot: screenshotUrl,
      transactionId,
      amount: finalAmount,
      status: 'Pending',
      couponCode: couponCode ? couponCode.toUpperCase().trim() : '',
      discountAmount
    });

    const savedPayment = await payment.save();

    // 🔔 Notify admin via email (non-blocking)
    try {
      const user = await User.findById(req.user._id).select('name email');
      if (user) {
        await notifyAdminOfPayment(
          { name: user.name, email: user.email },
          bundleTitle || `Bundle #${bundleId}`,
          Number(amount),
          screenshotUrl,
          (savedPayment._id as any).toString()
        );
      }
    } catch (emailErr) {
      console.error('[PaymentController] Failed to send admin notification:', emailErr);
    }

    res.status(201).json(savedPayment);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentId, status, ottUsername, ottPassword } = req.body; // status = 'Approved' | 'Rejected'
    
    const payment = await Payment.findById(paymentId).populate('userId', 'name email');
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    payment.status = status;
    if (status === 'Approved' && ottUsername) payment.ottUsername = ottUsername;
    if (status === 'Approved' && ottPassword) payment.ottPassword = ottPassword;
    const updatedPayment = await payment.save();

    // 📧 If Approved, send credentials to the user via email
    if (status === 'Approved' && ottUsername && ottPassword) {
      try {
        const user = payment.userId as any;
        if (user && user.email) {
          const bundle = await import('../models/Bundle').then(m => m.default.findById(payment.bundleId));
          const bundleTitle = bundle?.title || `Bundle #${payment.bundleId}`;
          await sendUserOTTCredentials(
            user.email,
            user.name,
            bundleTitle,
            ottUsername,
            ottPassword
          );
        }
      } catch (emailErr) {
        console.error('[PaymentController] Failed to send credentials email:', emailErr);
      }
    }
    
    res.json(updatedPayment);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = status;

    const payments = await Payment.find(filter)
      .populate('userId', 'name email')
      .populate({ path: 'bundleId', select: 'title price brand validity', populate: { path: 'brand', select: 'name category' } })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate({ path: 'bundleId', select: 'title price brand validity', populate: { path: 'brand', select: 'name category' } })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
