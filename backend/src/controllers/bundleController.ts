import { Request, Response } from 'express';
import Bundle from '../models/Bundle';

export const getBundles = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const filter = category ? { category } : {};
    const bundles = await Bundle.find(filter);
    res.json(bundles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBundle = async (req: Request, res: Response) => {
  try {
    const { title, category, apps, bundlePrice, originalPrice } = req.body;
    const bundle = new Bundle({ title, category, apps, bundlePrice, originalPrice });
    const createdBundle = await bundle.save();
    res.status(201).json(createdBundle);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
