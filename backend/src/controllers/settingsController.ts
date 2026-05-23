import { Request, Response } from 'express';
import Settings from '../models/Settings';
import { AuthRequest } from '../middleware/auth';
import { uploadToImageKit } from '../services/imagekitService';

// Get the global settings (singleton)
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default if it doesn't exist
      settings = new Settings({ paymentQrUrl: '', upiId: '' });
      await settings.save();
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update the global settings
export const updateSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ paymentQrUrl: '', upiId: '' });
    }

    if (req.body.upiId !== undefined) {
      settings.upiId = req.body.upiId;
    }

    if (req.file) {
      // Upload the parsed in-memory buffer to ImageKit
      const imageUrl = await uploadToImageKit(req.file.buffer, req.file.originalname);
      settings.paymentQrUrl = imageUrl;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

