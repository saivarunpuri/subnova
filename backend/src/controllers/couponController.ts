import { Request, Response } from 'express';
import Coupon from '../models/Coupon';
import Payment from '../models/Payment';
import Pack from '../models/Pack';
import { AuthRequest } from '../middleware/auth';

// Validate coupon
export const validateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, packId } = req.body;

    if (!code || !packId) {
      res.status(400).json({ message: 'Coupon code and Pack ID are required' });
      return;
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      res.status(404).json({ message: 'Invalid or inactive coupon code' });
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
      couponCode: code.toUpperCase(),
      status: { $in: ['Pending', 'Approved'] }
    });

    if (existingPayment) {
      res.status(400).json({ message: 'You have already used this coupon code' });
      return;
    }

    // Get pack to calculate final price
    const pack = await Pack.findById(packId);
    if (!pack) {
      res.status(404).json({ message: 'Pack not found' });
      return;
    }

    const originalPrice = pack.price;
    let discountAmount = 0;

    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((originalPrice * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    // Discount cannot exceed the price
    discountAmount = Math.min(discountAmount, originalPrice);
    const discountedPrice = Math.max(0, originalPrice - discountAmount);

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      discountedPrice
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all coupons (Admin)
export const getCoupons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new coupon (Admin)
export const createCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, discountType, discountValue, expiryDate, isActive } = req.body;

    if (!code || !discountType || !discountValue || !expiryDate) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      res.status(400).json({ message: 'Coupon code already exists' });
      return;
    }

    const newCoupon = new Coupon({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      expiryDate: new Date(expiryDate),
      isActive: isActive !== undefined ? isActive : true
    });

    const savedCoupon = await newCoupon.save();
    res.status(201).json(savedCoupon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a coupon (Admin)
export const updateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { code, discountType, discountValue, expiryDate, isActive } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }

    if (code) {
      const codeExists = await Coupon.findOne({ code: code.toUpperCase(), _id: { $ne: id } });
      if (codeExists) {
        res.status(400).json({ message: 'Coupon code already exists' });
        return;
      }
      coupon.code = code.toUpperCase().trim();
    }

    if (discountType) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (expiryDate) coupon.expiryDate = new Date(expiryDate);
    if (isActive !== undefined) coupon.isActive = isActive;

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a coupon (Admin)
export const deleteCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
