import { Request, Response } from 'express';
import Payment from '../models/Payment';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { notifyAdminOfPayment, sendUserOTTCredentials } from '../services/emailService';

// Note: Cloudinary should be configured with env vars in index.ts or config/cloudinary.ts

export const submitPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bundleId, transactionId, amount, bundleTitle } = req.body;
    
    if (!req.file) {
      res.status(400).json({ message: 'Screenshot is required' });
      return;
    }

    const screenshotUrl = `/uploads/${req.file.filename}`;

    const payment = new Payment({
      userId: req.user._id,
      bundleId,
      screenshot: screenshotUrl,
      transactionId,
      amount,
      status: 'Pending'
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
      .populate('bundleId', 'title')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
