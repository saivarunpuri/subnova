import { Request, Response } from 'express';
import OTTBrand from '../models/OTTBrand';
import Pack from '../models/Pack';

// ==================== BRAND CONTROLLERS ====================

export const getBrands = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;
    const filter = category ? { category } : {};
    const brands = await OTTBrand.find(filter);
    res.json(brands);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, category, logo, description } = req.body;
    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required' });
    }
    const brand = new OTTBrand({ name, category, logo, description });
    const createdBrand = await brand.save();
    res.status(201).json(createdBrand);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, logo, description } = req.body;
    const brand = await OTTBrand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    if (name) brand.name = name;
    if (category) brand.category = category;
    if (logo !== undefined) brand.logo = logo;
    if (description !== undefined) brand.description = description;

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const brand = await OTTBrand.findById(id);
    if (!brand) {
      return res.status(404).json({ message: 'Brand not found' });
    }
    await brand.deleteOne();
    // Also delete all packs belonging to this brand to maintain database consistency
    await Pack.deleteMany({ brand: id });
    res.json({ message: 'Brand and its associated packs deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== PACK CONTROLLERS ====================

export const getPacks = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.query;
    const filter = brandId ? { brand: String(brandId) } : {};
    const packs = await Pack.find(filter).populate('brand');
    res.json(packs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pack = await Pack.findById(id).populate('brand');
    if (!pack) {
      return res.status(404).json({ message: 'Subscription pack not found' });
    }
    res.json(pack);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPack = async (req: Request, res: Response) => {
  try {
    const { brand, title, price, originalPrice, validity, features, description } = req.body;
    if (!brand || !title || price === undefined || originalPrice === undefined || !validity) {
      return res.status(400).json({ message: 'All pack fields are required' });
    }
    
    // Check if brand exists
    const existingBrand = await OTTBrand.findById(brand);
    if (!existingBrand) {
      return res.status(404).json({ message: 'Parent OTT Brand not found' });
    }

    const pack = new Pack({
      brand,
      title,
      price,
      originalPrice,
      validity,
      features: features || [],
      description: description || ''
    });

    const createdPack = await pack.save();
    res.status(201).json(createdPack);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePack = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, price, originalPrice, validity, features, description } = req.body;
    
    const pack = await Pack.findById(id);
    if (!pack) {
      return res.status(404).json({ message: 'Subscription pack not found' });
    }

    if (title) pack.title = title;
    if (price !== undefined) pack.price = price;
    if (originalPrice !== undefined) pack.originalPrice = originalPrice;
    if (validity) pack.validity = validity;
    if (features) pack.features = features;
    if (description !== undefined) pack.description = description;

    const updatedPack = await pack.save();
    res.json(updatedPack);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePack = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pack = await Pack.findById(id);
    if (!pack) {
      return res.status(404).json({ message: 'Subscription pack not found' });
    }
    await pack.deleteOne();
    res.json({ message: 'Subscription pack deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
