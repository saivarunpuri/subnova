import { Request, Response } from 'express';
import Settings from '../models/Settings';
import { AuthRequest } from '../middleware/auth';

// Get the global settings (singleton)
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default if it doesn't exist
      settings = new Settings({ paymentQrUrl: '' });
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
      settings = new Settings({ paymentQrUrl: '' });
    }

    if (req.file) {
      // Storing path that is accessible via express.static
      settings.paymentQrUrl = `/uploads/${req.file.filename}`;
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
